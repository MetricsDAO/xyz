import { BigNumber } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { useContracts } from "./useContracts";

export function useUpvoteQuestion({ questionId }: { questionId: number }) {
  const { chain } = useNetwork();
  const { questionAPIJson } = useContracts({ chainId: chain?.id });
  const { config } = usePrepareContractWrite({
    addressOrName: questionAPIJson.address,
    contractInterface: questionAPIJson.abi,
    functionName: "upvoteQuestion",
    args: [BigNumber.from(questionId)],
  });

  return useContractWrite(config);
}
