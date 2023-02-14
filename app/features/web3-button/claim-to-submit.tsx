import { Button } from "~/components";
import type { ClaimToSubmitPrepared } from "~/domain";
import { useClaimToSubmit } from "~/hooks/use-claim-to-submit";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ClaimToSubmitWeb3Button(props: Web3Hook<ClaimToSubmitPrepared>) {
  const { write } = useClaimToSubmit(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button size="md" type="button" onClick={onClick}>
        <span> Claim </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
