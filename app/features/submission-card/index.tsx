import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { Submission } from "@prisma/client";
import { Link, useParams } from "@remix-run/react";
import { Card, Score, UserBadge } from "~/components";
import { fromNow } from "~/utils/date";

type Props = {
  submission: Submission;
  totalReviews: number;
};

export function SubmissionCard({ submission, totalReviews }: Props) {
  const { mType } = useParams();

  return (
    <Card className="text-sm p-6 space-y-4">
      <Link
        to={`/app/${mType}/m/${submission.laborMarketAddress}/s/${submission.contractId}`}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        {mType === "brainstorm" ? (
          <BrainstormInfo submission={submission} />
        ) : (
          <AnalyticsInfo submission={submission} />
        )}
        <div className="flex flex-col items-center gap-2">
          <Score score={submission.score} />
          <p className="text-xs text-gray-500 text-center">{totalReviews} reviews</p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center text-xs">
        <span className="mr-1">{fromNow(submission.createdAt)} by </span>
        <UserBadge url="u/id" address={submission.creatorId as `0x${string}`} balance={200} />
      </div>
    </Card>
  );
}

function BrainstormInfo({ submission }: { submission: Submission }) {
  return (
    <main className="space-y-2 flex-1">
      <h4 className="font-medium text-gray-900">{submission.title}</h4>
      <section className="text-gray-900">{submission.description}</section>
    </main>
  );
}

function AnalyticsInfo({ submission }: { submission: Submission }) {
  return (
    <main className="text-blue-600 text-sm flex flex-row items-center flex-1">
      {submission.title} <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
    </main>
  );
}
