import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ServiceRequestContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import { unixTimestamp } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";

type Props = Web3Hook<ServiceRequestContract>;

export function useCreateServiceRequest({ data, onWriteSuccess, onPrepareTransactionError }: Props) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as `0x${string}`,
    abi: LaborMarket.abi,
    functionName: "submitRequest",
    args: [
      data.pTokenAddress as `0x${string}`,
      toTokenAmount(data.pTokenQuantity),
      BigNumber.from(unixTimestamp(data.signalExpiration)),
      BigNumber.from(unixTimestamp(data.submissionExpiration)),
      BigNumber.from(unixTimestamp(data.enforcementExpiration)),
      data.uri,
    ],
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
