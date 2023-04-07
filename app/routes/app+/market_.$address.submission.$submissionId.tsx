import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import clsx from "clsx";
import { useRef, useState } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Detail,
  DetailItem,
  Drawer,
  UserBadge,
  ValidatedSelect,
} from "~/components";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { RewardBadge } from "~/components/reward-badge";
import { ScoreBadge, scoreToLabel } from "~/components/score";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import { ReviewSearchSchema } from "~/domain/review/schemas";
import { getIndexedServiceRequest } from "~/domain/service-request/functions.server";
import { getIndexedSubmission } from "~/domain/submission/functions.server";
import type { SubmissionDoc } from "~/domain/submission/schemas";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ReviewCreator } from "~/features/review-creator";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useReward } from "~/hooks/use-reward";
import { findUserReview, searchReviews } from "~/domain/review/functions.server";
import { getUser } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";
import { SCORE_COLOR } from "~/utils/constants";
import { dateHasPassed, fromNow } from "~/utils/date";
import { fromTokenAmount, submissionCreatedDate } from "~/utils/helpers";

const paramsSchema = z.object({
  address: EvmAddressSchema,
  submissionId: z.string(),
});

const validator = withZod(ReviewSearchSchema);

export const loader = async (data: DataFunctionArgs) => {
  const user = await getUser(data.request);
  const { address, submissionId } = paramsSchema.parse(data.params);
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ReviewSearchSchema);
  const reviews = await searchReviews({ ...params, submissionId, laborMarketAddress: address });
  const reviewedByUser = user && (await findUserReview(submissionId, address, EvmAddressSchema.parse(user.address)));

  const tokens = await listTokens();

  const submission = await getIndexedSubmission(address, submissionId);
  if (!submission) {
    throw notFound({ submissionId });
  }
  const laborMarket = await getIndexedLaborMarket(address);
  invariant(laborMarket, "Labor market not found");

  const serviceRequest = await getIndexedServiceRequest(address, submission.serviceRequestId);
  invariant(serviceRequest, "Service request not found");

  return typedjson(
    { submission, reviews, params, laborMarket, user, reviewedByUser, serviceRequest, tokens },
    { status: 200 }
  );
};

export default function ChallengeSubmission() {
  const { submission, reviews, params, laborMarket, user, reviewedByUser, serviceRequest, tokens } =
    useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const submittedByUser = user && user.address === submission.configuration.serviceProvider;

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  const setOrder = (str: "asc" | "desc") => {
    searchParams.set("order", str);
    setSearchParams(searchParams);
  };

  const token = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pToken);
  const { data: reward } = useReward({
    laborMarketAddress: submission.laborMarketAddress,
    submissionId: submission.id,
    tokenDecimals: token?.decimals ?? 18,
  });

  const enforcementExpirationPassed = dateHasPassed(serviceRequest.configuration.enforcementExp);
  const score = submission.score?.avg;

  const isWinner =
    enforcementExpirationPassed &&
    reward !== undefined &&
    (reward.paymentTokenAmount.gt(0) || reward.reputationTokenAmount.gt(0)) &&
    score &&
    score > 24;

  return (
    <Container className="pt-7 pb-16 px-10">
      <Breadcrumbs
        crumbs={[
          { link: `/app/analyze`, name: "Marketplaces" },
          { link: `/app/market/${laborMarket.address}`, name: laborMarket.appData?.title ?? "" },
          {
            link: `/app/market/${laborMarket.address}/request/${submission.serviceRequestId}`,
            name: serviceRequest.appData?.title ?? "",
          },
        ]}
      />
      <section className="flex flex-col md:flex-row gap-5 justify-between pb-10 items-center">
        <div className="flex items-center gap-2 md:basis-3/4">
          <h1 className="text-3xl font-semibold">{submission.appData?.title}</h1>
          {isWinner && <img className="w-12 h-12" src="/img/trophy.svg" alt="trophy" />}
        </div>
        <div className="flex md:basis-1/4 md:justify-end">
          {!submittedByUser ? (
            <ReviewQuestionDrawerButton submission={submission} laborMarket={laborMarket} />
          ) : (
            <p className="text-sm">Your Submission!</p>
          )}
        </div>
      </section>
      <section className="flex flex-col space-y-6 pb-24">
        <Detail className="flex flex-wrap gap-x-8 gap-y-4">
          <DetailItem title="Analyst">
            <UserBadge address={submission.configuration.serviceProvider} />
          </DetailItem>
          <DetailItem title="Created">
            <Badge>{fromNow(submissionCreatedDate(submission))}</Badge>
          </DetailItem>
          {score && (
            <DetailItem title="Overall Score">
              <ScoreBadge score={score} />
            </DetailItem>
          )}
          <DetailItem title="Reviews">
            {reviewedByUser ? (
              <div className="inline-flex items-center text-sm border border-blue-600 rounded-full px-3 h-8 w-fit whitespace-nowrap">
                <img src="/img/review-avatar.png" alt="" className="h-4 w-4 mr-1" />
                <p className="font-medium">{`You${reviews.length === 1 ? "" : ` + ${reviews.length - 1} reviews`}`}</p>
              </div>
            ) : (
              <Badge>{reviews.length}</Badge>
            )}
          </DetailItem>
          {isWinner && (
            <DetailItem title="Reward">
              <RewardBadge
                variant="winner"
                payment={{
                  amount: reward.displayPaymentTokenAmount,
                  token,
                  tooltipAmount: `${fromTokenAmount(reward.paymentTokenAmount.toString(), token?.decimals ?? 18)} ${
                    token?.symbol ?? ""
                  }`,
                }}
                reputation={{ amount: reward.displayReputationTokenAmount }}
              />
            </DetailItem>
          )}
        </Detail>
        <div className="bg-sky-500 bg-opacity-10 p-1 w-fit rounded">
          <a
            href={submission.appData?.submissionUrl}
            target="_blank"
            className="text-blue-600 text-sm flex flex-row items-center"
            rel="noreferrer"
          >
            {submission.appData?.title} dashboard <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      </section>
      <h2 className="text-lg font-semibold border-b border-gray-100 py-4 mb-6">Reviews ({reviews.length})</h2>

      <section className="mt-3">
        <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
          <main className="flex-1">
            <div className="w-full border-spacing-4 border-separate space-y-4">
              {reviews.map((r) => {
                return (
                  <Card asChild key={r.reviewer}>
                    <div className="flex flex-col md:flex-row gap-3 py-4 px-6 items-center space-between">
                      <div className="flex flex-col md:flex-row items-center flex-1 gap-x-8 gap-y-2">
                        <div
                          className={clsx(
                            SCORE_COLOR[scoreToLabel(Number(r.score) * 25)],
                            "flex w-24 h-9 justify-center items-center rounded-lg text-sm"
                          )}
                        >
                          <p>{scoreToLabel(Number(r.score) * 25)}</p>
                        </div>
                        <UserBadge address={r.reviewer as `0x${string}`} variant="separate" />
                      </div>
                      <p className="text-sm">{fromNow(r.blockTimestamp)}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </main>
          <aside className="md:w-1/5">
            <ValidatedForm
              formRef={formRef}
              method="get"
              defaultValues={params}
              validator={validator}
              onChange={handleChange}
              className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-blue-300 bg-opacity-5 text-sm"
            >
              <div className="flex gap-2 w-full items-center">
                <div className="flex-1">
                  <ValidatedSelect
                    placeholder="Select option"
                    name="sortBy"
                    size="sm"
                    onChange={handleChange}
                    options={[
                      { label: "Created At", value: "blockTimestamp" },
                      { label: "Score", value: "score" },
                    ]}
                  />
                </div>
                <div>
                  <ChevronUpIcon
                    className={clsx("h-4 w-4 cursor-pointer", { "text-sky-500": searchParams.get("order") === "asc" })}
                    onClick={() => setOrder("asc")}
                  />
                  <ChevronDownIcon
                    className={clsx("h-4 w-4 cursor-pointer", { "text-sky-500": searchParams.get("order") === "desc" })}
                    onClick={() => setOrder("desc")}
                  />
                </div>
              </div>
              <Checkbox onChange={handleChange} id="great_checkbox" name="score" value="4" label="Great" />
              <Checkbox onChange={handleChange} id="good_checkbox" name="score" value="3" label="Good" />
              <Checkbox onChange={handleChange} id="average_checkbox" name="score" value="2" label="Average" />
              <Checkbox onChange={handleChange} id="bad_checkbox" name="score" value="1" label="Bad" />
              <Checkbox onChange={handleChange} id="spam_checkbox" name="score" value="0" label="Spam" />
            </ValidatedForm>
          </aside>
        </div>
      </section>
    </Container>
  );
}

function ReviewQuestionDrawerButton({
  submission,
  laborMarket,
}: {
  submission: SubmissionDoc;
  laborMarket: LaborMarketWithIndexData;
}) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { canReview } = usePrereqs({ laborMarket });

  return (
    <>
      {canReview && (
        <ConnectWalletWrapper
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <Button size="lg">
            <span>Review & Score</span>
          </Button>
        </ConnectWalletWrapper>
      )}
      <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        {isDrawerOpen && (
          <ReviewCreator
            laborMarketAddress={submission.laborMarketAddress}
            requestId={submission.serviceRequestId}
            submissionId={submission.id}
            onCancel={() => setDrawerOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
}
