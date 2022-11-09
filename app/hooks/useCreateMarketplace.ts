import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarketNew } from "~/domain";

const DEV_TEST_CONTRACT_ADDRESS = "0xd138D0B4F007EA66C8A8C0b95E671ffE788aa6A9";

export function useCreateMarketplace({
  data,
  isEnabled,
  onSuccess,
}: {
  data?: LaborMarketNew;
  isEnabled: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: DEV_TEST_CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "_num", type: "uint256" }],
        name: "test",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "test",
    enabled: isEnabled,
    args: data && data?.title.length > 0 ? [BigNumber.from(data.title.charCodeAt(0))] : [BigNumber.from(0)], //mocking
  });

  const { data: transactionResultData, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(data) {
      console.log("success", data);
      // TODO: (for test/dev) create marketplace in Prisma
      onSuccess?.(data);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
