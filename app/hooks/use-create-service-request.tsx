import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ServiceRequestContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import { unixTimestamp } from "~/utils/date";
import { changeAddressType, parseTokenAmount } from "~/utils/helpers";

type Props = Web3Hook<ServiceRequestContract>;

export function useCreateServiceRequest({ data, onWriteSuccess }: Props) {
  const { config } = usePrepareContractWrite({
    address: changeAddressType(data.laborMarketAddress),
    abi: LaborMarket.abi,
    functionName: "submitRequest",
    overrides: {
      gasLimit: BigNumber.from(1000000), // TODO: What do we do here?
    },
    args: [
      changeAddressType(data.pTokenAddress),
      parseTokenAmount(data.pTokenQuantity),
      BigNumber.from(unixTimestamp(data.signalExpiration)),
      BigNumber.from(unixTimestamp(data.submissionExpiration)),
      BigNumber.from(unixTimestamp(data.enforcementExpiration)),
      data.uri,
    ],
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
