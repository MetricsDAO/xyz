import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Web3Hook } from "~/features/web3-button/types";
import { changeAddressType, parseTokenAmount } from "~/utils/helpers";

export type ApproveERC20ContractData = {
  ERC20address: string;
  spender: `0x${string}`;
  amount: string;
};

export function useApproveERC20({ data, onWriteSuccess }: Web3Hook<ApproveERC20ContractData>) {
  const { config } = usePrepareContractWrite({
    address: changeAddressType(data.ERC20address),
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
    args: [data.spender, parseTokenAmount(data.amount)],
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
