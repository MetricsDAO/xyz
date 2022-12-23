import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { ReviewPrepared } from "~/domain";

export function useReviewSubmission({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: ReviewPrepared;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: "0xd46740251edf9f0e64f6a594960b99e242db5bd2",
    abi: LaborMarket.abi,
    functionName: "review",
    args: [BigNumber.from(data.requestId), BigNumber.from(data.submissionId), BigNumber.from(data.score)],
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
      console.log("error", error);
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
