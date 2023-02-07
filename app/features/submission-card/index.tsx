import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "@remix-run/react";
import { Card, Score, UserBadge } from "~/components";
import { fromNow } from "~/utils/date";
import { $path } from "remix-routes";
import invariant from "tiny-invariant";
import type { ChallengeSubmissonProps } from "app/routes/app/$mType/m/$laborMarketAddress.s/$contractId";

export function SubmissionCard({ submission }: ChallengeSubmissonProps) {
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  return (
    <Card className="text-sm p-6 space-y-4">
      <Link
        to={$path("/app/:mType/m/:laborMarketAddress/s/:contractId", {
          mType: mType,
          laborMarketAddress: submission.laborMarketAddress,
          contractId: submission.id,
        })}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        {mType === "brainstorm" ? (
          <BrainstormInfo submission={submission} />
        ) : (
          <AnalyticsInfo submission={submission} />
        )}
        <div className="flex flex-col items-center gap-2">
          {/* hard coded for now */}
          <Score score={2} />
          <p className="text-xs text-gray-500 text-center">{submission.reviewCount} reviews</p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center text-xs">
        <span className="mr-1">{fromNow(submission.indexedAt)} by </span>
        <UserBadge url="u/id" address={submission.configuration.serviceProvider as `0x${string}`} balance={200} />
      </div>
    </Card>
  );
}

function BrainstormInfo({ submission }: ChallengeSubmissonProps) {
  return (
    <main className="space-y-2 flex-1">
      <h4 className="font-medium text-gray-900">{submission.appData?.title}</h4>
      <section className="text-gray-900">{submission.appData?.description}</section>
    </main>
  );
}

function AnalyticsInfo({ submission }: ChallengeSubmissonProps) {
  return (
    <main className="text-blue-600 text-sm flex flex-row items-center flex-1">
      {submission.su} <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
    </main>
  );
}
