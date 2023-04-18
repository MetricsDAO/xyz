import { Link } from "@remix-run/react";
import { Card } from "~/components/card";
import type { Reward } from "~/domain/reward/functions.server";
import { useReward } from "~/hooks/use-reward";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";
import { RewardDisplay, Status } from "./column-data";

export function RewardsCards({ rewards }: { rewards: Reward[] }) {
  return (
    <div className="space-y-4">
      {rewards.map((r) => {
        return <RewardCard key={`${r.submission.laborMarketAddress}_${r.submission.id}`} reward={r} />;
      })}
    </div>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  const { data: contractReward } = useReward({
    laborMarketAddress: reward.submission.laborMarketAddress,
    submissionId: reward.submission.id,
    tokenDecimals: reward.token?.decimals ?? 18,
  });

  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <Link
        className="text-blue-600"
        to={`/app/market/${reward.submission.laborMarketAddress}/submission/${reward.submission.id}`}
      >
        {reward.submission.sr.appData.title}
      </Link>
      <div>Reward</div>
      <div>
        <RewardDisplay reward={contractReward} token={reward.token} />
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(submissionCreatedDate(reward.submission))} </p>
      <div>Status</div>
      <Status reward={reward} contractReward={contractReward} />
    </Card>
  );
}
