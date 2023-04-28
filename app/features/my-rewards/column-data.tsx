import { RewardBadge } from "~/components/reward-badge";
import type { Reward } from "~/domain/reward/functions.server";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { ClaimButton } from "./claim-button";
import { RedeemButton } from "./redeem-button";

export function RewardDisplay({ reward }: { reward: Reward }) {
  return (
    <RewardBadge
      payment={{
        amount: reward.chain.displayPaymentTokenAmount,
        token: reward.app.token,
      }}
      reputation={{ amount: reward.chain.displayReputationTokenAmount }}
    />
  );
}

export function Status({ reward }: { reward: Reward }) {
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.submission.laborMarketAddress,
    id: reward.submission.id,
    action: "HAS_CLAIMED",
  });
  if (!reward.chain.hasReward) {
    return <span>No reward</span>;
  }

  if (hasClaimed === undefined) {
    // Loading
    return <>--</>;
  }
  // TODO
  const isIOUToken = reward.app.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D";
  if (isIOUToken) {
    return (
      <div className="flex flex-wrap gap-2">
        <ClaimButton reward={reward} disabled={hasClaimed} />
        <RedeemButton reward={reward} disabled={!hasClaimed || reward.treasury?.hasRedeemed === true} />
      </div>
    );
  }
  return <ClaimButton reward={reward} disabled={hasClaimed} />;
}
