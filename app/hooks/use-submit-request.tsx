import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { ChallengePrepared } from "~/domain";
import { unixTimestamp } from "~/utils/date";
import { createServiceRequest } from "~/utils/fetch";
import { parseTokenAmount } from "~/utils/helpers";

export function useSubmitRequest({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: ChallengePrepared;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "submitRequest",
    overrides: {
      gasLimit: BigNumber.from(1000000), // TODO: What do we do here?
    },
    args: [
      data.pTokenAddress as `0x${string}`,
      BigNumber.from(data.pTokenId),
      parseTokenAmount(data.pTokenQuantity),
      BigNumber.from(unixTimestamp(data.signalExpiration)),
      BigNumber.from(unixTimestamp(data.submissionExpiration)),
      BigNumber.from(unixTimestamp(data.enforcementExpiration)),
      data.uri,
    ],
  });
  const { data: transactionResultData, write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.();
    },
  });

  console.log("data", data);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(receipt) {
      if (window.ENV.DEV_AUTO_INDEX) {
        console.log("DEV_AUTO_INDEX is true, creating service request", data);
        createServiceRequest(data);
      }
      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
