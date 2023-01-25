import { Button } from "~/components";
import type { ApproveERC20ContractData } from "~/hooks/use-approve-erc20";
import { useApproveERC20 } from "~/hooks/use-approve-erc20";
import type { Web3Hook } from "./types";

export function ApproveERC20TransferWeb3Button({ data, onWriteSuccess }: Web3Hook<ApproveERC20ContractData>) {
  const { write } = useApproveERC20({ data, onWriteSuccess });

  const onClick = () => {
    write?.();
  };

  return (
    <Button size="md" type="button" onClick={onClick}>
      Approve
    </Button>
  );
}
