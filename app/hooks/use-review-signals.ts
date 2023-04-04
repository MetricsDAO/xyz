import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "./use-root-data";

export function useReviewSignals({
  laborMarketAddress,
  serviceRequestId,
}: {
  laborMarketAddress: EvmAddress;
  serviceRequestId: string;
}) {
  const contracts = useContracts();
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "reviewSignals",
    args: [BigNumber.from(serviceRequestId), userAddress as `0x${string}`],
  });

  return data;
}
