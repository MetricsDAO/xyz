import { useNetwork } from "wagmi";
import { Button } from "~/components";
import type { ClaimToReviewContract } from "~/domain";
import { useClaimToReview } from "~/hooks/use-claim-to-review";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ClaimToReviewWeb3Button({ data, onWriteSuccess }: Web3Hook<ClaimToReviewContract>) {
  const { write } = useClaimToReview({ data, onWriteSuccess });
  const { chain } = useNetwork();

  const onClick = () => {
    if (chain?.name !== "Ethereum") {
      write?.();
    }
  };

  return (
    <ConnectWalletWrapper>
      <Button asChild size="md" type="button" onClick={onClick}>
        <span>Claim to Review </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
