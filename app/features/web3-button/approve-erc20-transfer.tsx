import { Button } from "~/components";
import type { ApproveERC20ContractData } from "~/hooks/use-approve-erc20";
import { useApproveERC20 } from "~/hooks/use-approve-erc20";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ApproveERC20TransferWeb3Button(props: Web3Hook<ApproveERC20ContractData>) {
  const { write } = useApproveERC20(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button size="md" type="button" onClick={onClick} fullWidth>
        <span> Approve </span>
      </Button>
    </ConnectWalletWrapper>
  );
}
