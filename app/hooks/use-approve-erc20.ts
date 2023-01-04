import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { utils } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

type Data = {
  ERC20address: string;
  spender: `0x${string}`;
  amount: number;
};

export function useApproveERC20({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: Data;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: data.ERC20address,
    abi: [
      {
        constant: false,
        inputs: [
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "approve",
    args: [data.spender, utils.parseUnits(data.amount.toString(), 18)],
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
      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
