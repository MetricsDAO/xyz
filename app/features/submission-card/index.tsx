import type { Submission } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Card, Score, UserBadge } from "~/components";
import { fromNow } from "~/utils/date";

type Props = {
  submission: Submission;
  totalReviews: number;
};

export function SubmissionCard({ submission, totalReviews }: Props) {
  return (
    <Card className="text-sm p-6 space-y-4">
      <Link
        to={`/app/brainstorm/m/${submission.laborMarketAddress}/s/${submission.contractId}`}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        <main className="space-y-2 flex-1">
          <h4 className="font-medium text-gray-900">{submission.title}</h4>
          <section className="text-gray-900">{submission.description}</section>
        </main>
        <div className="flex flex-col items-center gap-2">
          <Score score={submission.score} />
          <p className="text-xs text-gray-500 text-center">{totalReviews} reviews</p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center text-xs">
        <span className="mr-1">{fromNow(submission.createdAt)} by </span>
        <UserBadge url="u/id" address="0x983110309620D911731Ac0932219af06091b6744" balance={200} />
      </div>
    </Card>
  );
}
