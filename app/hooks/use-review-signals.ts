import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useAccount, useContractRead } from "wagmi";

export function useReviewSignals({
  laborMarketAddress,
  serviceRequestId,
}: {
  laborMarketAddress: `0x${string}`;
  serviceRequestId: string;
}) {
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "reviewSignals",
    args: [BigNumber.from(serviceRequestId), userAddress as EvmAddress],
  });

  return data;
}
