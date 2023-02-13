import { Button } from "~/components";
import type { ClaimRewardContractData } from "~/hooks/use-claim-reward";
import { useClaimReward } from "~/hooks/use-claim-reward";
import type { Web3Hook } from "./types";

export function ClaimRewardWeb3Button(props: Web3Hook<ClaimRewardContractData>) {
  const { write } = useClaimReward(props);

  const onClick = () => {
    write?.();
  };

  return <Button onClick={onClick}>Claim</Button>;
}
