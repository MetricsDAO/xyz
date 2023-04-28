import { RewardBadge } from "~/components/reward-badge";
import type { Reward } from "~/domain/reward/functions.server";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";
import { RedeemButton } from "./redeem-button";

export function RewardDisplay({ reward }: { reward: Reward }) {
  return (
    <RewardBadge
      payment={{
        amount: fromTokenAmount(reward.chain.paymentTokenAmount, reward.app.token?.decimals ?? 18, 2),
        token: reward.app.token,
      }}
      reputation={{ amount: reward.chain.reputationTokenAmount }}
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
  if (reward.app.token?.iou) {
    return (
      <div className="flex flex-wrap gap-2">
        <ClaimButton reward={reward} disabled={hasClaimed} />
        <RedeemButton reward={reward} disabled={!hasClaimed || reward.treasury?.hasRedeemed === true} />
      </div>
    );
  }
  return <ClaimButton reward={reward} disabled={hasClaimed} />;
}
