import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useParams, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import type { SendTransactionResult } from "@wagmi/core";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { useRef, useState } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
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
  Modal,
  UserBadge,
  ValidatedSelect,
} from "~/components";
import { RewardBadge } from "~/components/reward-badge";
import { scoreToLabel } from "~/components/score";
import type { ReviewContract } from "~/domain/review";
import { ReviewSearchSchema } from "~/domain/review";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { RPCError } from "~/features/rpc-error";
import { ReviewSubmissionWeb3Button } from "~/features/web3-button/review-submission";
import type { EthersError } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { useOptionalUser } from "~/hooks/use-user";
import { searchReviews } from "~/services/review-service.server";
import { findSubmission } from "~/services/submissions.server";
import { SCORE_COLOR } from "~/utils/constants";
import { fromNow } from "~/utils/date";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";

const paramsSchema = z.object({
  laborMarketAddress: z.string(),
  submissionId: z.string(),
});

const validator = withZod(ReviewSearchSchema);

export const loader = async (data: DataFunctionArgs) => {
  const { laborMarketAddress, submissionId } = paramsSchema.parse(data.params);
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ReviewSearchSchema);
  const reviews = await searchReviews({ ...params, submissionId, laborMarketAddress });

  const submission = await findSubmission(submissionId, laborMarketAddress);
  if (!submission) {
    throw notFound({ submissionId });
  }

  return typedjson({ submission, reviews, params }, { status: 200 });
};

const reviewSubmissionMachine = createBlockchainTransactionStateMachine<ReviewContract>();

export type ChallengeSubmissonProps = {
  submission: UseDataFunctionReturn<typeof loader>["submission"];
};

export default function ChallengeSubmission() {
  const { submission, reviews, params } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const { mType } = useParams();

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  const isWinner = false;

  return (
    <Container className="py-16 px-10">
      <section className="flex flex-wrap gap-5 justify-between pb-10">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{submission.appData?.title}</h1>
          {isWinner && <img className="w-12 h-12" src="/img/trophy.svg" alt="trophy" />}
        </div>
        <ReviewQuestionDrawerButton
          requestId={submission.serviceRequestId}
          submissionId={submission.id}
          laborMarketAddress={submission.laborMarketAddress}
        />
      </section>
      <section className="flex flex-col space-y-6 pb-24">
        <Detail className="flex flex-wrap gap-x-8 gap-y-4">
          <DetailItem title="Author">
            <UserBadge address={submission.configuration.serviceProvider as `0x${string}`} />
          </DetailItem>
          <DetailItem title="Created">
            <Badge>{fromNow(submission.createdAtBlockTimestamp)}</Badge>
          </DetailItem>
          <DetailItem title="Overall Score">{/* <ScoreBadge score={submission.score} /> */}</DetailItem>
          <DetailItem title="Reviews">
            {true ? (
              <div className="inline-flex items-center text-sm border border-blue-600 rounded-full px-3 h-8 w-fit whitespace-nowrap">
                <img src="/img/review-avatar.png" alt="" className="h-4 w-4 mr-1" />
                <p className="font-medium">{`You + ${reviews.length} reviewers`}</p>
              </div>
            ) : (
              <Badge>{reviews.length}</Badge>
            )}
          </DetailItem>
          {isWinner && (
            <DetailItem title="Winner">
              <RewardBadge amount={50} token="SOL" rMETRIC={5000} variant="winner" />
            </DetailItem>
          )}
        </Detail>
        {mType === "brainstorm" ? (
          <BrainstormDescription submission={submission} />
        ) : (
          <AnalyzeDescription submission={submission} />
        )}
      </section>
      <h2 className="text-lg font-semibold border-b border-gray-100 py-4 mb-6">Reviews ({reviews.length})</h2>

      <section className="mt-3">
        <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
          <main className="flex-1">
            <div className="w-full border-spacing-4 border-separate space-y-5">
              {reviews.map((r) => {
                return (
                  <Card asChild key={r._id.toString()}>
                    <div className="flex flex-col md:flex-row gap-3 py-3 px-4 items-center space-between">
                      <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                        <div
                          className={clsx(
                            SCORE_COLOR[scoreToLabel(r.score)],
                            "flex w-24 h-12 justify-center items-center rounded-lg"
                          )}
                        >
                          <p>{scoreToLabel(r.score)}</p>
                        </div>
                        <UserBadge address={r.reviewer as `0x${string}`} />
                      </div>
                      <p>{fromNow(r.createdAtBlockTimestamp)}</p>
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
              {/* <Input placeholder="Search" name="search" iconLeft={<MagnifyingGlassIcon className="w-5 h-5" />} /> */}
              <ValidatedSelect
                placeholder="Select option"
                name="sortBy"
                size="sm"
                onChange={handleChange}
                options={[{ label: "Created At", value: "createdAt" }]}
              />
              <Checkbox onChange={handleChange} id="great_checkbox" name="score" value="Great" label="Great" />
              <Checkbox onChange={handleChange} id="good_checkbox" name="score" value="Good" label="Good" />
              <Checkbox onChange={handleChange} id="average_checkbox" name="score" value="Average" label="Average" />
              <Checkbox onChange={handleChange} id="bad_checkbox" name="score" value="Bad" label="Bad" />
              <Checkbox onChange={handleChange} id="spam_checkbox" name="score" value="Spam" label="Spam" />
            </ValidatedForm>
          </aside>
        </div>
      </section>
    </Container>
  );
}

function ReviewQuestionDrawerButton({
  laborMarketAddress,
  requestId,
  submissionId,
}: {
  laborMarketAddress: string;
  requestId: string;
  submissionId: string;
}) {
  const user = useOptionalUser();
  const [selected, setSelected] = useState<number>(2);
  const [scoreSelectionOpen, setScoreSelectionOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, send] = useMachine(reviewSubmissionMachine, {
    actions: {
      notifyTransactionWait: (context) => {
        defaultNotifyTransactionActions.notifyTransactionWait(context);
      },
      notifyTransactionSuccess: (context) => {
        defaultNotifyTransactionActions.notifyTransactionSuccess(context);
      },
      notifyTransactionFailure: () => {
        defaultNotifyTransactionActions.notifyTransactionFailure();
      },
    },
  });

  const handleReviewSubmission = () => {
    send({ type: "RESET_TRANSACTION" });
    send({
      type: "PREPARE_TRANSACTION_READY",
      data: {
        laborMarketAddress: laborMarketAddress,
        submissionId: submissionId,
        requestId: requestId,
        score: selected,
      },
    });
    setIsModalOpen(true);
  };

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };

  return (
    <>
      <ConnectWalletWrapper>
        <Button
          size="lg"
          onClick={() => {
            user && setScoreSelectionOpen(true);
          }}
        >
          <span>Review & Score</span>
        </Button>
      </ConnectWalletWrapper>
      <Drawer
        open={scoreSelectionOpen && !state.matches("transactionWait")}
        onClose={() => setScoreSelectionOpen(false)}
      >
        {scoreSelectionOpen && (
          <div className="flex flex-col mx-auto space-y-10 px-2">
            <div className="space-y-3">
              <p className="text-3xl font-semibold">Review & Score</p>
              <p className="italic text-gray-500 text-sm">
                Important: You can't edit this score after submitting. Double check your score and ensure it's good to
                go
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => setSelected(4)}
                className={clsx("hover:bg-green-200", {
                  "bg-green-200": selected === 4,
                })}
              >
                Great
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelected(3)}
                className={clsx("hover:bg-blue-200", {
                  "bg-blue-200": selected === 3,
                })}
              >
                Good
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelected(2)}
                className={clsx("hover:bg-gray-200", {
                  "bg-gray-200": selected === 2,
                })}
              >
                Average
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelected(1)}
                className={clsx("hover:bg-orange-200", {
                  "bg-orange-200": selected === 1,
                })}
              >
                Bad
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelected(0)}
                className={clsx("hover:bg-red-200", {
                  "bg-red-200": selected === 0,
                })}
              >
                Spam
              </Button>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="cancel" fullWidth onClick={() => setScoreSelectionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReviewSubmission} fullWidth>
                Submit Score
              </Button>
            </div>
          </div>
        )}
      </Drawer>
      {state.context.contractData && isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-5">
            <p className="text-3xl font-semibold">Review & Score</p>
            <p>
              Please confirm that you would like to give this submission a score of
              <b>{` ${scoreToLabel(state.context.contractData.score)}`}</b>.
            </p>
            {error && <RPCError error={error} />}
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Button variant="cancel" size="md" fullWidth onClick={() => setIsModalOpen(false)}>
                Back
              </Button>
              {!error && (
                <ReviewSubmissionWeb3Button
                  data={state.context.contractData}
                  onWriteSuccess={onWriteSuccess}
                  onPrepareTransactionError={onPrepareTransactionError}
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function AnalyzeDescription({ submission }: ChallengeSubmissonProps) {
  return (
    <>
      <p className="text-gray-500 max-w-2xl text-sm">{submission.appData?.description}</p>
      <div className="bg-sky-500 bg-opacity-10 p-1 w-fit rounded">
        <a href={submission.appData?.description} className="text-blue-600 text-sm flex flex-row items-center">
          {submission.appData?.title} dashboard <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
        </a>
      </div>
    </>
  );
}

function BrainstormDescription({ submission }: ChallengeSubmissonProps) {
  return (
    <>
      <p className="text-gray-500 max-w-2xl text-sm">{submission.appData?.description}</p>
    </>
  );
}
