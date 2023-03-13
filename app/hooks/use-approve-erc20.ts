import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Web3Hook } from "~/features/web3-button/types";
import { toTokenAmount } from "~/utils/helpers";

export type ApproveERC20ContractData = {
  ERC20address: string;
  decimals: number;
  spender: `0x${string}`;
  amount: string;
};

export function useApproveERC20({
  data,
  onWriteSuccess,
  onPrepareTransactionError,
}: Web3Hook<ApproveERC20ContractData>) {
  const { config } = usePrepareContractWrite({
    address: data.ERC20address as `0x${string}`,
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
    args: [data.spender, toTokenAmount(data.amount, data.decimals)],
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
