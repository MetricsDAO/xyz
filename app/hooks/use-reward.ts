import { BigNumber } from "ethers";
import { ScalableLikertEnforcement } from "labor-markets-abi";
import { useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { displayBalance, fromTokenAmount } from "~/utils/helpers";

type Props = {
  laborMarketAddress: EvmAddress;
  submissionId: string;
  tokenDecimals: number;
};
export type Reward = ReturnType<typeof useReward>["data"];

/**
 * Get the user's reward for a submission. The payment token and reputation token.
 */
export function useReward({ laborMarketAddress, submissionId, tokenDecimals }: Props) {
  return useContractRead({
    address: ScalableLikertEnforcement.address,
    abi: ScalableLikertEnforcement.abi,
    functionName: "getRewards",
    args: [laborMarketAddress, BigNumber.from(submissionId)],
    select(data) {
      return {
        paymentTokenAmount: data[0],
        reputationTokenAmount: data[1],
        displayPaymentTokenAmount: fromTokenAmount(data[0].toString(), tokenDecimals, 2),
        displayReputationTokenAmount: displayBalance(data[1]),
        hasReward: data[0].gt(0) || data[1].gt(0),
      };
    },
  });
}
