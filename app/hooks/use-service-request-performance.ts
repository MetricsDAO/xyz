import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "./use-root-data";

type Props = {
  laborMarketAddress: EvmAddress;
  serviceRequestId: number; // Could be a service request id or submissionid
};

/**
 * * Hook to call the labor market contract and determine if a user has signaled or submitted on a service request
 */
export function useServiceRequestPerformance({ laborMarketAddress, serviceRequestId }: Props) {
  const contracts = useContracts();
  const { address: userAddress } = useAccount();

  const { data } = useContractRead({
    enabled: !!userAddress,
    address: laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "requestIdToAddressToPerformance",
    args: [BigNumber.from(serviceRequestId), userAddress!],
  });

  if (!data) return undefined;

  return checkState(data);
}

function checkState(num: number) {
  // 0: Not signaled, 1: Signaled, 2: Submitted.
  // For review performance: Uses the last 22 bits of the performance value by shifting over 2 values and then masking down to the last 22 bits with an overlap of 0x3fffff.
  const state = {
    signaled: (num & 0x1) === 1,
    submitted: (num & 0x2) === 2,
    remainingReviews: ((num >> 2) & 0x3fffff) > 0,
  };
  return state;
}
