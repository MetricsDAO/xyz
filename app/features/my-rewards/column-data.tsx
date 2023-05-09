import { useNetwork } from "wagmi";
import { RewardBadge } from "~/components/reward-badge";
import type { EvmAddress } from "~/domain/address";
import type { Reward } from "~/domain/reward/functions.server";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { useOptionalUser } from "~/hooks/use-user";
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
  const user = useOptionalUser();
  const network = useNetwork();
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
        {/* Claim to the signed in wallet instead of user specified wallet */}
        <ClaimButton
          reward={reward}
          disabled={hasClaimed}
          payoutAddress={user?.address as EvmAddress}
          network={network.chain?.name}
        />
        <RedeemButton reward={reward} disabled={!hasClaimed || reward.treasury?.hasRedeemed === true} />
      </div>
    );
  }
  console.log("reward", reward);
  return (
    <ClaimButton
      reward={reward}
      disabled={hasClaimed}
      payoutAddress={reward.app.wallet?.address as EvmAddress}
      network={reward.app.token?.networkName}
    />
  );
}
