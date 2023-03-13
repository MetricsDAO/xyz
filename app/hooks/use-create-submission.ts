import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { SubmissionContract } from "~/domain/submission/schemas";
import type { Web3Hook } from "~/features/web3-button/types";

export function useCreateSubmission({ data, onWriteSuccess, onPrepareTransactionError }: Web3Hook<SubmissionContract>) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as `0x${string}`,
    abi: LaborMarket.abi,
    functionName: "provide",
    args: [BigNumber.from(data.serviceRequestId), data.uri],
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
