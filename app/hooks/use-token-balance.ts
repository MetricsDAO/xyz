import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useAccount, useContractRead } from "wagmi";

type Props = { tokenAddress: `0x${string}`; tokenId: string };

export function useTokenBalance({ tokenAddress, tokenId }: Props) {
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: tokenAddress,
    abi: ReputationToken.abi, // same abi as rep token
    functionName: "balanceOf",
    args: [userAddress as EvmAddress, BigNumber.from(tokenId)],
  });

  return data;
}
