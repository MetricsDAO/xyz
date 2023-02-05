import { Button } from "~/components";
import type { SubmissionContract } from "~/domain/submission";
import { useCreateSubmission } from "~/hooks/use-create-submission";
import type { Web3Hook } from "./types";

export function CreateSubmissionWeb3Button({ data, onWriteSuccess }: Web3Hook<SubmissionContract>) {
  console.log("CreateSubmissionWeb3Button", { data, onWriteSuccess });
  const { write } = useCreateSubmission({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick} fullWidth>
      Submit
    </Button>
  );
}
