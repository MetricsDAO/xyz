import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ClaimToReviewContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import { changeAddressType } from "~/utils/helpers";

export function useClaimToReview({ data, onWriteSuccess }: Web3Hook<ClaimToReviewContract>) {
  const { config } = usePrepareContractWrite({
    address: changeAddressType(data.laborMarketAddress),
    abi: LaborMarket.abi,
    functionName: "signalReview",
    args: [BigNumber.from(data.quantity)],
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
