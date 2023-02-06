import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useAccount, useContractRead } from "wagmi";

/**
 * Hook to call the labor market contract and determine which actions a signed in user has performed on a service request.
 * Undefined if not logged in or during loading.
 */
export function useHasPerformed({
  laborMarketAddress,
  serviceRequestId,
  action,
}: {
  laborMarketAddress: `0x${string}`;
  serviceRequestId: string;
  action: "HAS_CLAIMED" | "HAS_REVIEWED" | "HAS_SUBMITTED";
}) {
  const { address } = useAccount();

  const { data: hasPerformed } = useContractRead({
    address: laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: action,
  });

  const { data } = useContractRead({
    enabled: !!address && !!hasPerformed,
    address: laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "hasPerformed",
    args: [BigNumber.from(serviceRequestId), address as `0x${string}`, hasPerformed as `0x${string}`],
  });

  return data;
}
