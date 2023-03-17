import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";

export function useReviewSignals({
  laborMarketAddress,
  serviceRequestId,
}: {
  laborMarketAddress: EvmAddress;
  serviceRequestId: string;
}) {
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "reviewSignals",
    args: [BigNumber.from(serviceRequestId), userAddress as `0x${string}`],
  });

  return data;
}
