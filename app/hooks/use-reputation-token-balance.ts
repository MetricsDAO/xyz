import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import { useContracts } from "./use-root-data";

/**
 * Get the user's reputation token balance
 * @returns {BigNumber | undefined} - undefined if user is not connected or still loading
 */
export function useReputationTokenBalance(): BigNumber | undefined {
  const contracts = useContracts();
  const { address: userAddress } = useAccount();
  const { data: reputationBalance } = useContractRead({
    enabled: !!userAddress,
    address: contracts.BucketEnforcement.address
    abi: contracts.BucketEnforcement.abi,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  return reputationBalance;
}
