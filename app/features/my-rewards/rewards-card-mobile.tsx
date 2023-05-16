import { Link } from "@remix-run/react";
import { Card } from "~/components/card";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";
import { RewardDisplay, Status } from "./column-data";

export function RewardsCards({ submissions }: { submissions: SubmissionWithReward[] }) {
  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        return <RewardCard key={`${s.laborMarketAddress}_${s.id}`} submission={s} />;
      })}
    </div>
  );
}

function RewardCard({ submission }: { submission: SubmissionWithReward }) {
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <Link className="text-blue-600" to={`/app/market/${submission.laborMarketAddress}/submission/${submission.id}`}>
        {submission.sr.appData.title}
      </Link>
      <div>Reward</div>
      <div>
        <RewardDisplay submission={submission} />
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(submissionCreatedDate(submission))} </p>
      <div>Status</div>
      <Status submission={submission} />
    </Card>
  );
}
