import { BigNumber } from "ethers";
import { ScalableLikertEnforcement } from "labor-markets-abi";
import { useContractRead } from "wagmi";

type Props = {
  laborMarketAddress: `0x${string}`;
  submissionId: string;
};

/**
 * Get the user's reward for a submission. The payment token and reputation token.
 * @returns { { tokenAmount: BigNumber; rMetric: BigNumber } | undefined} - undefined if still loading
 */
export function useGetReward({ laborMarketAddress, submissionId }: Props) {
  const { data } = useContractRead({
    address: ScalableLikertEnforcement.address,
    abi: ScalableLikertEnforcement.abi,
    functionName: "getRewards",
    args: [laborMarketAddress, BigNumber.from(submissionId)],
  });

  if (data) {
    return {
      tokenAmount: data[0],
      rMetric: data[1],
    };
  }

  return data;
}
