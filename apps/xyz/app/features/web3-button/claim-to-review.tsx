import { Button } from "~/components";
import type { ClaimToReviewContract } from "~/domain";
import { useClaimToReview } from "~/hooks/use-claim-to-review";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ClaimToReviewWeb3Button(props: Web3Hook<ClaimToReviewContract>) {
  const { write } = useClaimToReview(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper onClick={onClick}>
      <Button size="md" type="button">
        Claim to Review
      </Button>
    </ConnectWalletWrapper>
  );
}