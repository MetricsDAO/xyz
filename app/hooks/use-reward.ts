import { BigNumber } from "ethers";
import type { EvmAddress } from "~/domain/address";

type Props = {
  laborMarketAddress: EvmAddress;
  submissionId: string;
  serviceRequestId: string;
};
// export type Reward = ReturnType<typeof useReward>["data"];

/**
 * Get the user's reward for a submission. The payment token and reputation token.
 */
export function useReward({ laborMarketAddress, submissionId, serviceRequestId }: Props) {
  // const contracts = useContracts();

  // return useContractRead({
  //   address: contracts.BucketEnforcement.address,
  //   abi: contracts.BucketEnforcement.abi,
  //   functionName: "getRewards",
  //   args: [laborMarketAddress, BigNumber.from(serviceRequestId), BigNumber.from(submissionId)],
  //   select(data) {
  //     return data;
  //   },
  // });
  return BigNumber.from(1);
}
