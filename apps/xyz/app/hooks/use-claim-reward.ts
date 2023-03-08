import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Web3Hook } from "~/features/web3-button/types";

export type ClaimRewardContractData = { laborMarketAddress: string; submissionId: string; payoutAddress: string };

type Props = Web3Hook<ClaimRewardContractData>;

export function useClaimReward({ data, onWriteSuccess, onPrepareTransactionError }: Props) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as `0x${string}`,
    abi: LaborMarket.abi,
    functionName: "claim",
    args: [BigNumber.from(data.submissionId), data.payoutAddress as `0x${string}`],
    onError(err) {
      onPrepareTransactionError?.(err);
    },
  });
  const { write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.(result);
    },
  });

  return {
    write,
  };
}
