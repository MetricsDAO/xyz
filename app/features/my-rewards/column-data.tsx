import type { Token } from "@prisma/client";
import { RewardBadge } from "~/components/reward-badge";
import type { Reward } from "~/domain/reward/functions.server";
import { useHasPerformed } from "~/hooks/use-has-performed";
import type { Reward as RewardHook } from "~/hooks/use-reward";
import { ClaimButton } from "./claim-button";
import { RedeemButton } from "./redeem-button";

export function RewardDisplay({ reward, token }: { reward: RewardHook; token?: Token }) {
  return (
    <>
      {reward?.hasReward ? (
        <RewardBadge
          payment={{ amount: reward.displayPaymentTokenAmount, token }}
          reputation={{ amount: reward.displayReputationTokenAmount }}
        />
      ) : (
        <span>--</span>
      )}
    </>
  );
}

export function Status(props: { contractReward: RewardHook; reward: Reward }) {
  // TODO
  const isIOUToken = props.reward.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D";
  if (isIOUToken) {
    return <IOUTokenClaimButton {...props} />;
  }
  return <ERC20ClaimButton {...props} />;
}

function ERC20ClaimButton({ contractReward, reward }: { contractReward: RewardHook; reward: Reward }) {
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.submission.laborMarketAddress,
    id: reward.submission.id,
    action: "HAS_CLAIMED",
  });

  return (
    <>
      {!contractReward ? (
        <>--</>
      ) : hasClaimed === false && contractReward.hasReward ? (
        <ClaimButton reward={reward} rewardDisplayAmount={contractReward.displayPaymentTokenAmount} />
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <span>No reward</span>
      )}
    </>
  );
}

function IOUTokenClaimButton({ contractReward, reward }: { contractReward: RewardHook; reward: Reward }) {
  if (!contractReward) {
    // Loading
    return <>--</>;
  }

  if (!contractReward.hasReward) {
    return <span>No reward</span>;
  }

  return (
    <>
      <ClaimButton reward={reward} rewardDisplayAmount={contractReward.displayPaymentTokenAmount} />
      <RedeemButton reward={reward} />
    </>
  );
}
