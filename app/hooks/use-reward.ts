import { BigNumber } from "ethers";
import type { EvmAddress } from "~/domain/address";
<<<<<<< HEAD
import { useContracts } from "./use-root-data";
=======
>>>>>>> 5fa5e0d290ac29a4d5fc6a4ec2102a656cd2828c

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
<<<<<<< HEAD
  return BigNumber.from(2);
=======
  return BigNumber.from(1);
>>>>>>> 5fa5e0d290ac29a4d5fc6a4ec2102a656cd2828c
}
