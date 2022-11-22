import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarketPrepared } from "~/domain";

const DEV_TEST_CONTRACT_ADDRESS = "0xd138D0B4F007EA66C8A8C0b95E671ffE788aa6A9";

export function useCreateMarketplace({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: LaborMarketPrepared;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
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
    args: [BigNumber.from(0)], //mocking. Should come from labor market data in the future.
  });

  const { data: transactionResultData, write } = useContractWrite({
    ...config,
    onSuccess(result) {
      console.log("data that would be commited", data);
      // TODO: create transaction in Prisma
      onWriteSuccess?.();
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(receipt) {
      console.log("success", receipt);
      // TODO: update transaction in Prisma?
      // TODO: (for test/dev) create marketplace in Prisma
      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
