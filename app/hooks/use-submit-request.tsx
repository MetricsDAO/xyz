import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { ChallengeNew } from "~/domain";
import { unixTimestamp } from "~/utils/date";

export function useSubmitRequest({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: ChallengeNew;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  console.log("data", [
    data.pTokenAddress as `0x${string}`,
    data.pTokenId,
    data.pTokenQuantity,
    unixTimestamp(data.signalExpiration),
    unixTimestamp(data.submissionExpiration),
    unixTimestamp(data.enforcementExpiration),
    data.uri,
  ]);
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "submitRequest",
    args: [
      data.pTokenAddress as `0x${string}`,
      BigNumber.from(data.pTokenId),
      BigNumber.from(data.pTokenQuantity),
      BigNumber.from(unixTimestamp(data.signalExpiration)),
      BigNumber.from(unixTimestamp(data.submissionExpiration)),
      BigNumber.from(unixTimestamp(data.enforcementExpiration)),
      data.uri,
    ],
  });
  console.log("config", config);

  const { data: transactionResultData, write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.();
    },
  });

  console.log("data", transactionResultData, write);

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
