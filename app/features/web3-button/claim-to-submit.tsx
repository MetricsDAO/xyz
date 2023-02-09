import { Button } from "~/components";
import type { ClaimToSubmitPrepared } from "~/domain";
import { useClaimToSubmit } from "~/hooks/use-claim-to-submit";
import type { Web3Hook } from "./types";

export function ClaimToSubmitWeb3Button(props: Web3Hook<ClaimToSubmitPrepared>) {
  const { write } = useClaimToSubmit(props);

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Claim
    </Button>
  );
}
