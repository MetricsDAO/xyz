import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { Card, Score, UserBadge } from "~/components";
import type { LaborMarketDoc, SubmissionWithReviewsDoc } from "~/domain";
import { useUser } from "~/hooks/use-user";
import { fromNow } from "~/utils/date";

export function SubmissionCard({
  submission,
  laborMarket,
}: {
  laborMarket: LaborMarketDoc;
  submission: SubmissionWithReviewsDoc;
}) {
  const user = useUser();
  const reviewedByUser = user && submission.reviews.find((review) => review.reviewer === user.address);

  const score = submission.score?.avg;
  return (
    <Card className="text-sm p-6 space-y-4">
      <Link
        to={`/app/market/${submission.laborMarketAddress}/submission/${submission.id}`}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        {laborMarket.appData?.type === "brainstorm" ? (
          <BrainstormInfo submission={submission} />
        ) : (
          <AnalyticsInfo submission={submission} />
        )}
        <div className="flex flex-col items-center gap-2 md:mr-7 md:ml-24">
          {score && <Score score={score} />}
          <div className="flex text-xs text-gray-500 items-center">
            {reviewedByUser ? (
              <>
                <img src="/img/review-avatar.png" alt="" className="h-4 w-4 mr-1" />
                <p className="text-zinc-800">You</p>
                <p>{" + "}</p>
              </>
            ) : (
              <></>
            )}
            <p>{submission.score?.reviewCount ?? 0} reviews</p>
          </div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center text-xs">
        <span className="mr-1">{fromNow(submission.createdAtBlockTimestamp)} by </span>
        <UserBadge address={submission.configuration.serviceProvider as `0x${string}`} />
      </div>
    </Card>
  );
}

function BrainstormInfo({ submission }: { submission: SubmissionWithReviewsDoc }) {
  return (
    <main className="space-y-2 flex-1 break-words text-ellipsis overflow-hidden max-h-96">
      <h4 className="font-medium text-gray-900">{submission.appData?.title}</h4>
      <section className="text-gray-900">{submission.appData?.description}</section>
    </main>
  );
}

function AnalyticsInfo({ submission }: { submission: SubmissionWithReviewsDoc }) {
  return (
    <main className="text-blue-600 text-sm flex flex-row items-center flex-1">
      {submission.appData?.title} <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
    </main>
  );
}
