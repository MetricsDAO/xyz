import { BigNumber } from "ethers";
import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";
import { SubmissionIOURewardCreator } from "../../reward-submission-creator/reward-submission-iou-creator";
import { RewardSubmissionCreator } from "../../reward-submission-creator/reward-submission-creator";

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
    return <SubmissionIOURewardCreator submission={submission} />;
  }
  return <RewardSubmissionCreator submission={submission} />;
}
