import { useNetwork } from "wagmi";
import { Button } from "~/components";
import type { ClaimRewardContractData } from "~/hooks/use-claim-reward";
import { useClaimReward } from "~/hooks/use-claim-reward";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ClaimRewardWeb3Button({ data, onWriteSuccess }: Web3Hook<ClaimRewardContractData>) {
  const { write } = useClaimReward({ data, onWriteSuccess });
  const { chain } = useNetwork();

  const onClick = () => {
    if (chain?.name !== "Ethereum") {
      write?.();
    }
  };

  return (
    <ConnectWalletWrapper>
      <Button asChild onClick={onClick}>
        <span> Claim</span>
      </Button>
    </ConnectWalletWrapper>
  );
}
