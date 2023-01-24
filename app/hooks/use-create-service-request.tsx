import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { ServiceRequestContract } from "~/domain";
import { unixTimestamp } from "~/utils/date";
import { createServiceRequest } from "~/utils/fetch";
import { parseTokenAmount } from "~/utils/helpers";

export function useCreateServiceRequest({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: ServiceRequestContract;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as `0x${string}`,
    abi: LaborMarket.abi,
    functionName: "submitRequest",
    overrides: {
      gasLimit: BigNumber.from(1000000), // TODO: What do we do here?
    },
    args: [
      data.pTokenAddress as `0x${string}`,
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

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(receipt) {
      if (window.ENV.DEV_AUTO_INDEX) {
        console.log("DEV_AUTO_INDEX is enabled, creating service request", receipt, data);
        createServiceRequest({
          ...data,
          contractId: "1", // hardcoding to 1 for now. Doesn't seem to be a way to get this out of the receipt
        });
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
