import type { Token, Wallet } from "@prisma/client";
import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithServiceRequest } from "~/domain/submission/schemas";
import { useHasPerformed } from "~/hooks/use-has-performed";
import type { Reward as RewardHook } from "~/hooks/use-reward";
import { ClaimButton } from "./claim-button";

export function Reward({ reward, token }: { reward: RewardHook; token?: Token }) {
  return (
    <>
      {reward?.hasReward ? (
        <RewardBadge
          paymentTokenAmount={reward.displayReputationTokenAmount}
          tokenSymbol={token?.symbol ?? ""}
          reputationTokenAmount={reward.displayReputationTokenAmount}
        />
      ) : (
        <span>--</span>
      )}
    </>
  );
}

export function Status({
  reward,
  submission,
  wallets,
}: {
  reward: RewardHook;
  submission: SubmissionWithServiceRequest;
  wallets: Wallet[];
}) {
  const hasClaimed = useHasPerformed({
    laborMarketAddress: submission.laborMarketAddress,
    id: submission.id,
    action: "HAS_CLAIMED",
  });
  return (
    <>
      {!reward ? (
        <>--</>
      ) : hasClaimed === false && reward.hasReward ? (
        <ClaimButton rewardAmount={reward.displayPaymentTokenAmount} submission={submission} wallets={wallets} />
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <span>No reward</span>
      )}
    </>
  );
}
