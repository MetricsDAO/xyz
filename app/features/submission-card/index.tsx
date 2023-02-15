import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "@remix-run/react";
import { $path } from "remix-routes";
import invariant from "tiny-invariant";
import { Card, UserBadge } from "~/components";
import type { SubmissionDoc } from "~/domain";
import { fromNow } from "~/utils/date";

export function SubmissionCard({ submission }: { submission: SubmissionDoc }) {
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  return (
    <Card className="text-sm p-6 space-y-4">
      <Link
        to={$path("/app/:mType/m/:laborMarketAddress/s/:submissionId", {
          mType: mType,
          laborMarketAddress: submission.laborMarketAddress,
          submissionId: submission.id,
        })}
        className="flex flex-col-reverse md:flex-row space-y-reverse space-y-4"
      >
        {mType === "brainstorm" ? (
          <BrainstormInfo submission={submission} />
        ) : (
          <AnalyticsInfo submission={submission} />
        )}
        <div className="flex flex-col items-center gap-2">
          {/* MVP HIDE */}
          {/* <Score score={2} /> */}
          <div className="flex text-xs text-gray-500 items-center">
            {/*TODO: use actual data */}
            {false ? (
              <>
                <img src="/img/review-avatar.png" alt="" className="h-4 w-4 mr-1" />
                <p className="text-zinc-800">You</p>
                <p>{" + "}</p>
              </>
            ) : (
              <></>
            )}
            <p>{submission.reviewCount} reviewers</p>
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

function BrainstormInfo({ submission }: { submission: SubmissionDoc }) {
  return (
    <main className="space-y-2 flex-1">
      <h4 className="font-medium text-gray-900">{submission.appData?.title}</h4>
      <section className="text-gray-900">{submission.appData?.description}</section>
    </main>
  );
}

function AnalyticsInfo({ submission }: { submission: SubmissionDoc }) {
  return (
    <main className="text-blue-600 text-sm flex flex-row items-center flex-1">
      {submission.appData?.title} <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
    </main>
  );
}
