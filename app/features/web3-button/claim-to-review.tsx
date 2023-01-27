import { Button } from "~/components";
import type { ClaimToReviewContract } from "~/domain";
import { useClaimToReview } from "~/hooks/use-claim-to-review";
import type { Web3Hook } from "./types";

export function ClaimToReviewWeb3Button({ data, onWriteSuccess }: Web3Hook<ClaimToReviewContract>) {
  const { write } = useClaimToReview({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Claim to Review
    </Button>
  );
}
