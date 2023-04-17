import type { Wallet } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Card } from "~/components/card";
import type { SubmissionWithServiceRequest } from "~/domain/submission/schemas";
import { useReward } from "~/hooks/use-reward";
import { useTokens } from "~/hooks/use-root-data";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";
import { Reward, Status } from "./column-data";

export function RewardsCards({ rewards, wallets }: { rewards: SubmissionWithServiceRequest[]; wallets: Wallet[] }) {
  return (
    <div className="space-y-4">
      {rewards.map((r) => {
        return <RewardCard key={`${r.laborMarketAddress}_${r.id}`} reward={r} wallets={wallets} />;
      })}
    </div>
  );
}

function RewardCard({ reward, wallets }: { reward: SubmissionWithServiceRequest; wallets: Wallet[] }) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === reward.sr.configuration.pToken);
  const { data: contractReward } = useReward({
    laborMarketAddress: reward.laborMarketAddress,
    submissionId: reward.id,
    tokenDecimals: token?.decimals ?? 18,
  });

  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <Link className="text-blue-600" to={`/app/market/${reward.laborMarketAddress}/submission/${reward.id}`}>
        {reward.sr.appData.title}
      </Link>
      <div>Reward</div>
      <div>
        <Reward reward={contractReward} token={token} />
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(submissionCreatedDate(reward))} </p>
      <div>Status</div>
      <Status reward={contractReward} submission={reward} wallets={wallets} />
    </Card>
  );
}
