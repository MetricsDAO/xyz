import type { TransactionReceipt } from "@ethersproject/abstract-provider";

export type Web3Hook<ContractData> = {
  data: ContractData;
  onTransactionSuccess?: (receipt: TransactionReceipt) => void;
  onWriteSuccess?: (hash: `0x${string}`) => void;
};
