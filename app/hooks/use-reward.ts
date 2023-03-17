import { BigNumber } from "ethers";
import { ScalableLikertEnforcement } from "labor-markets-abi";
import { useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";

type Props = {
  laborMarketAddress: EvmAddress;
  submissionId: string;
};

/**
 * Get the user's reward for a submission. The payment token and reputation token.
 * @returns { { paymentTokenAmount: BigNumber; reputationTokenAmount: BigNumber } | undefined} - undefined if still loading
 */
export function useReward({ laborMarketAddress, submissionId }: Props) {
  const { data } = useContractRead({
    address: ScalableLikertEnforcement.address,
    abi: ScalableLikertEnforcement.abi,
    functionName: "getRewards",
    args: [laborMarketAddress, BigNumber.from(submissionId)],
  });

  if (data) {
    return {
      paymentTokenAmount: data[0],
      reputationTokenAmount: data[1],
    };
  }

  return data;
}
