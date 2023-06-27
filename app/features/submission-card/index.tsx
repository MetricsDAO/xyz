import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { Card, Score, UserBadge } from "~/components";
import type { SubmissionWithReviewsDoc } from "~/domain/submission/schemas";
import { useOptionalUser } from "~/hooks/use-user";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";

export function SubmissionCard({
  submission,
  onStateChange,
}: {
  submission: SubmissionWithReviewsDoc;
  onStateChange: (state: boolean, submissionId: string) => void;
}) {
  const user = useOptionalUser();
  const reviewedByUser = user && submission.reviews.find((review) => review.reviewer === user.address);

  const score = submission.score ? Math.floor(submission.score.reviewSum / submission.score.reviewCount) : undefined; // TODO average?
  return (
    <Card className="text-sm p-6 space-y-4 hover:cursor-pointer">
      <div
        onClick={() => onStateChange(true, submission.id)}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        <main className="text-blue-600 text-sm flex flex-row items-center flex-1">
          {submission.appData?.title} <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
        </main>
        <div className="flex flex-col items-center gap-2 md:mr-7 md:ml-24">
          {score !== undefined && <Score score={score} />}
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
      </div>
      <div className="flex flex-wrap items-center text-xs">
        <span className="mr-1">{fromNow(submissionCreatedDate(submission))} by </span>
        <UserBadge address={submission.configuration.fulfiller} />
      </div>
    </Card>
  );
}
