import { Button } from "~/components";
import type { SubmissionContract } from "~/domain/submission";
import { useCreateSubmission } from "~/hooks/use-create-submission";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function CreateSubmissionWeb3Button(props: Web3Hook<SubmissionContract>) {
  const { write } = useCreateSubmission(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button size="md" type="button" onClick={onClick}>
        <span> Submit </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
