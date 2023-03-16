import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ClaimToSubmitPrepared } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";

export function useClaimToSubmit({ data, onWriteSuccess, onPrepareTransactionError }: Web3Hook<ClaimToSubmitPrepared>) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as EvmAddress,
    abi: LaborMarket.abi,
    functionName: "signal",
    args: [BigNumber.from(data.serviceRequestId)],
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
