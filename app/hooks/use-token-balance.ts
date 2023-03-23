import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import { useContracts } from "./use-root-data";

type Props = { tokenAddress: `0x${string}`; tokenId: string };

export function useTokenBalance({ tokenAddress, tokenId }: Props) {
  const contracts = useContracts();
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: tokenAddress,
    abi: contracts.ReputationToken.abi, // same abi as rep token
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`, BigNumber.from(tokenId)],
  });

  return data;
}
