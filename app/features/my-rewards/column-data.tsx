import { RewardBadge } from "~/components/reward-badge";
import type { Reward } from "~/domain/reward/functions.server";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { ClaimButton } from "./claim-button";
import { RedeemButton } from "./redeem-button";

export function RewardDisplay({ reward }: { reward: Reward }) {
  return (
    <RewardBadge
      payment={{
        amount: reward.amounts.displayPaymentTokenAmount,
        token: reward.token,
      }}
      reputation={{ amount: reward.amounts.displayReputationTokenAmount }}
    />
  );
}

export function Status(props: { reward: Reward }) {
  // TODO
  const isIOUToken = props.reward.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D";
  if (isIOUToken) {
    return <IOUTokenClaimButton {...props} />;
  }
  return <ERC20ClaimButton {...props} />;
}

function ERC20ClaimButton({ reward }: { reward: Reward }) {
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.submission.laborMarketAddress,
    id: reward.submission.id,
    action: "HAS_CLAIMED",
  });

  if (!reward.hasReward) {
    return <span>No reward</span>;
  }

  return (
    <>
      {hasClaimed === undefined ? (
        // Loading
        <>--</>
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <ClaimButton reward={reward} />
      )}
    </>
  );
}

function IOUTokenClaimButton({ reward }: { reward: Reward }) {
  if (!reward.hasReward) {
    return <span>No reward</span>;
  }

  return (
    <>
      <ClaimButton reward={reward} />
      <RedeemButton reward={reward} />
    </>
  );
}
