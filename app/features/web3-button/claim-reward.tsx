import { Button } from "~/components";
import type { ClaimRewardContractData } from "~/hooks/use-claim-reward";
import { useClaimReward } from "~/hooks/use-claim-reward";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { Web3Hook } from "./types";

export function ClaimRewardWeb3Button(props: Web3Hook<ClaimRewardContractData>) {
  const { write } = useClaimReward(props);

  const onClick = () => {
    write?.();
  };

  return (
    <ConnectWalletWrapper>
      <Button asChild onClick={onClick}>
        <span> Claim</span>
      </Button>
    </ConnectWalletWrapper>
  );
}
