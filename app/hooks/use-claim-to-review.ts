import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ClaimToReviewContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";

export function useClaimToReview({ data, onWriteSuccess, onPrepareTransactionError }: Web3Hook<ClaimToReviewContract>) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as EvmAddress,
    abi: LaborMarket.abi,
    functionName: "signalReview",
    args: [BigNumber.from(data.serviceRequestId), BigNumber.from(data.quantity)],
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
