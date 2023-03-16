import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useAccount, useContractRead } from "wagmi";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";

/**
 * Get the user's reputation token balance
 * @returns {BigNumber | undefined} - undefined if user is not connected or still loading
 */
export function useReputationTokenBalance(): BigNumber | undefined {
  const { address: userAddress } = useAccount();
  const { data: reputationBalance } = useContractRead({
    enabled: !!userAddress,
    address: ReputationToken.address,
    abi: ReputationToken.abi,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  return reputationBalance;
}
