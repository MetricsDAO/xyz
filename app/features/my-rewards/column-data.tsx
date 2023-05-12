import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";
import { ClaimIouTokenButton } from "./claim-iou-token-button";
import { RedeemButton } from "./redeem-button";

export function RewardDisplay({ submission }: { submission: SubmissionWithReward }) {
  const { paymentTokenAmount, reputationTokenAmount, token } = submission.serviceProviderReward.reward;
  return (
    <RewardBadge
      payment={{
        amount: fromTokenAmount(paymentTokenAmount, token?.decimals ?? 18, 2),
        token: token ?? undefined,
      }}
      reputation={{ amount: reputationTokenAmount }}
    />
  );
}

export function Status({ submission }: { submission: SubmissionWithReward }) {
  const { hasReward, isIou } = submission.serviceProviderReward.reward;
  if (!hasReward) {
    return <span>No reward</span>;
  }

  if (isIou) {
    return (
      <div className="flex flex-wrap gap-2">
        <ClaimIouTokenButton submission={submission} />
        <RedeemButton submission={submission} />
      </div>
    );
  }
  return <ClaimButton submission={submission} />;
}
