import { useQuery } from "@tanstack/react-query";
import { useProvider } from "wagmi";
import { BucketEnforcement__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "./use-root-data";

type Props = {
  laborMarketAddress: EvmAddress;
  submissionId: string;
  serviceRequestId: string;
};
export type Reward = ReturnType<typeof useReward>["data"];

/**
 * Get the user's reward for a submission. The payment token and reputation token.
 */
export function useReward({ laborMarketAddress, submissionId, serviceRequestId }: Props) {
  const contracts = useContracts();
  const provider = useProvider();

  return useQuery(["reward", laborMarketAddress, submissionId, serviceRequestId], async () => {
    const contract = BucketEnforcement__factory.connect(contracts.BucketEnforcement.address, provider);
    return contract.callStatic.getRewards(laborMarketAddress, serviceRequestId, submissionId);
  });
}
