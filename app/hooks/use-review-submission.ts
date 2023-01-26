import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ReviewContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";

export function useReviewSubmission({ data, onWriteSuccess }: Web3Hook<ReviewContract>) {
  const { config } = usePrepareContractWrite({
    address: data.laborMarketAddress as `0x${string}`,
    abi: LaborMarket.abi,
    functionName: "review",
    args: [BigNumber.from(data.requestId), BigNumber.from(data.submissionId), BigNumber.from(data.score)],
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
