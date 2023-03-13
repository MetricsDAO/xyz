import { Button } from "~/components";
import type { SubmissionContract } from "~/domain/submission/schemas";
import { useCreateSubmission } from "~/hooks/use-create-submission";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateSubmissionWeb3Button(props: Web3Hook<SubmissionContract>) {
  const { write } = useCreateSubmission(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper onClick={onClick}>
      <Button size="md" type="button" fullWidth>
        <span> Submit </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
