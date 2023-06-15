import { BigNumber } from "ethers";
import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";
import { RedeemRewardCreator } from "../redeem-reward-creator/submission-iou-creator";
import { ClaimButton } from "./claim-button";

export function RewardDisplay({ submission }: { submission: SubmissionWithReward }) {
  const tokens = useTokens();
  const { tokenAmount, tokenAddress } = submission.reward;

  const token = tokens.find((t) => t.contractAddress === tokenAddress);

  return (
    <RewardBadge
      payment={{
        amount: fromTokenAmount(tokenAmount, token?.decimals ?? 18, 2),
        token: token ?? undefined,
      }}
    />
  );
}

export function Status({ submission }: { submission: SubmissionWithReward }) {
  const { tokenAmount, isIou } = submission.reward;
  if (BigNumber.from(tokenAmount).lte(0)) {
    return <span>No reward</span>;
  }

  if (isIou) {
    return <RedeemRewardCreator submission={submission} />;
  }
  return <ClaimButton submission={submission} />;
}
