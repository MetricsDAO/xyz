import { Button } from "~/components";
import type { ReviewContract } from "~/domain";
import { useReviewSubmission } from "~/hooks/use-review-submission";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ReviewSubmissionWeb3Button(props: Web3Hook<ReviewContract>) {
  const { write } = useReviewSubmission(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button size="md" type="button" onClick={onClick} fullWidth>
        <span>Submit Score</span>
      </Button>
    </ConnectWalletWrapper>
  );
}
