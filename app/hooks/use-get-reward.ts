import { BigNumber } from "ethers";
import { ScalableLikertEnforcement } from "labor-markets-abi";
import { useContractRead } from "wagmi";

type Props = {
  laborMarketAddress: `0x${string}`;
  submissionId: string;
};

/**
 * Get the user's reputation token balance
 * @returns {BigNumber | undefined} - undefined if user is not connected or still loading
 */
export function useGetReward({ laborMarketAddress, submissionId }: Props) {
  const { data } = useContractRead({
    address: ScalableLikertEnforcement.address,
    abi: ScalableLikertEnforcement.abi,
    functionName: "getRewards",
    args: [laborMarketAddress, BigNumber.from(submissionId)],
  });

  return data;
}
