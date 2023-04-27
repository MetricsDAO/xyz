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

export function Status(props: { reward: Reward }) {
  // TODO
  const isIOUToken = props.reward.app.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D";
  if (isIOUToken) {
    return <IOUTokenClaimAndRedeem {...props} />;
  }
  return <ERC20ClaimButton {...props} />;
}

function ERC20ClaimButton({ reward }: { reward: Reward }) {
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.submission.laborMarketAddress,
    id: reward.submission.id,
    action: "HAS_CLAIMED",
  });

  if (!reward.chain.hasReward) {
    return <span>No reward</span>;
  }

  return (
    <>
      {hasClaimed === undefined ? (
        // Loading
        <>--</>
      ) : (
        <ClaimButton reward={reward} hasClaimed={hasClaimed} />
      )}
    </>
  );
}

function IOUTokenClaimAndRedeem({ reward }: { reward: Reward }) {
  if (!reward.chain.hasReward) {
    return <span>No reward</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ERC20ClaimButton reward={reward} />
      <RedeemButton reward={reward} />
    </div>
  );
}
