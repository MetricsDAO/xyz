import type { Token, Wallet } from "database";
import { Card } from "~/components/card";
import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithServiceRequest } from "~/domain/submission";
import { useGetReward } from "~/hooks/use-get-reward";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { fromNow } from "~/utils/date";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";

export function RewardsCards({
  rewards,
  wallets,
  tokens,
}: {
  rewards: SubmissionWithServiceRequest[];
  wallets: Wallet[];
  tokens: Token[];
}) {
  return (
    <div className="space-y-4">
      {rewards.map((r) => {
        return <RewardCard key={`${r.laborMarketAddress}_${r.id}`} reward={r} wallets={wallets} tokens={tokens} />;
      })}
    </div>
  );
}

function RewardCard({
  reward,
  wallets,
  tokens,
}: {
  reward: SubmissionWithServiceRequest;
  wallets: Wallet[];
  tokens: Token[];
}) {
  const contractReward = useGetReward({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    id: reward.id,
    action: "HAS_CLAIMED",
  });
  const token = tokens.find((t) => t.contractAddress === reward.sr.configuration.pToken);
  const showReward = contractReward !== undefined && hasClaimed === false;
  const showRewarded = contractReward !== undefined && hasClaimed === true;
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <p>{reward.sr.appData?.title}</p>
      <div>Reward</div>
      <div>
        {showReward ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(reward.createdAtBlockTimestamp)} </p>
      <div>Rewarded</div>
      <div className="text-black" color="dark.3">
        {showRewarded ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </div>
      <div>Status</div>
      {hasClaimed === false ? (
        <ClaimButton reward={reward} wallets={wallets} tokens={tokens} />
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <></>
      )}
    </Card>
  );
}
