import { BigNumber } from "ethers";
import { RewardBadge } from "~/components/reward-badge";
import type { ReviewDoc } from "~/domain";
import { RewardReviewIOUCreator } from "~/features/reward-review-creator/reward-review-iou-creator";
import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";

export function RewardDisplay({ review }: { review: ReviewDoc }) {
  const tokens = useTokens();
  const { tokenAmount, tokenAddress } = review.reward;

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

export function Status({ review }: { review: ReviewDoc }) {
  const { tokenAmount, isIou } = review.reward;
  if (BigNumber.from(tokenAmount).lte(0)) {
    return <span>No reward</span>;
  }

  if (isIou) {
    return <RewardReviewIOUCreator review={review} />;
  }

  return <p>Paid</p>;
}
