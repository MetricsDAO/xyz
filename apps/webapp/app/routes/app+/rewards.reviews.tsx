import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import { Field, Label, ValidatedSelect } from "~/components";
import { Container } from "~/components/container";
import { Pagination } from "~/components/pagination/pagination";
import { ReviewSearchSchema } from "~/domain";
import type { EvmAddress } from "~/domain/address";
import { countReviews } from "~/domain/review/functions.server";
import { searchReviewsWithRewards } from "~/domain/reward-reviews/functions.server";
import { countSubmissionsWithRewards } from "~/domain/reward-submissions/functions.server";
import { RewardsSearchSchema } from "~/domain/reward-submissions/schema";
import { ReviewsRewardsListView } from "~/features/my-rewards/reviews/reviews-rewards-list-view";
import RewardsTab from "~/features/my-rewards/rewards-tab";
import { requireUser } from "~/services/session.server";
import { findAllWalletsForUser } from "~/services/wallet.server";

const validator = withZod(RewardsSearchSchema);

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireUser(request, "/app/login?redirectto=app/rewards/reviews");

  const url = new URL(request.url);
  const search = {
    ...getParamsOrFail(url.searchParams, ReviewSearchSchema),
    reviewer: user.address as EvmAddress,
  };
  const reviews = await searchReviewsWithRewards(search);
  const reviewCount = await countReviews(search);
  const submissionCount = await countSubmissionsWithRewards({
    fulfiller: user.address as EvmAddress,
    isPastEnforcementExpiration: true,
  });

  const wallets = await findAllWalletsForUser(user.id);

  return typedjson({
    search,
    reviews,
    reviewCount,
    submissionCount,
    walletsCount: wallets.length,
  });
};

export default function Rewards() {
  const { reviews, walletsCount, search, reviewCount, submissionCount } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Review Rewards</h1>
        <div>
          <p className="text-lg text-cyan-500">Claim reward tokens for all the reviews you've completed</p>
          <p className="text-gray-500 text-sm">
            View all your pending and claimed rewards and manage all your payout addresses
          </p>
          <div className="bg-amber-200/10 flex items-center rounded-md p-2 mt-2 w-fit">
            <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5 hidden md:block" />
            <p className="text-yellow-700 mr-2">
              Non-Polygon rewards need to be claimed within 28 days of being earned
            </p>
          </div>
        </div>
      </section>
      <RewardsTab addressesNum={walletsCount} reviewCount={reviewCount} submissionCount={submissionCount} />
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <ReviewsRewardsListView reviews={reviews} />
            <div className="w-fit m-auto">
              <Pagination page={search.page} totalPages={Math.ceil(reviewCount / search.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/4 lg:md-1/5">
          <SearchAndFilter />
        </aside>
      </section>
    </Container>
  );
}

function SearchAndFilter() {
  // const tokens = useTokens();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };
  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-gray-100 rounded-md bg-blue-300 bg-opacity-5"
    >
      <Field>
        <Label>Sort by</Label>
        <ValidatedSelect
          placeholder="Select option"
          name="sortBy"
          size="sm"
          onChange={handleChange}
          options={[
            { label: "Score", value: "score" },
            { label: "Submitted", value: "blockTimestamp" },
          ]}
        />
      </Field>
    </ValidatedForm>
  );
}
