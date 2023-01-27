import { Button } from "~/components";
import type { ReviewContract } from "~/domain";
import { useReviewSubmission } from "~/hooks/use-review-submission";
import type { Web3Hook } from "./types";

export function ReviewSubmissionWeb3Button({ data, onWriteSuccess }: Web3Hook<ReviewContract>) {
  const { write } = useReviewSubmission({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick} fullWidth>
      Submit Score
    </Button>
  );
}
