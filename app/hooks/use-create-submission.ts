import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { SubmissionContract } from "~/domain/submission";

export function useCreateSubmission({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: SubmissionContract;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "provide",
    args: [BigNumber.from(data.serviceRequestId), data.uri],
  });

  const { data: transactionResultData, write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.();
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.error(error);
    },
    onSuccess(receipt) {
      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}