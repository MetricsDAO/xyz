import type { TransactionReceipt } from "@ethersproject/abstract-provider";

export type SendTransactionResult = {
  hash: `0x${string}`;
  wait: (confirmations?: number | undefined) => Promise<TransactionReceipt>;
};

export type Web3Hook<ContractData> = {
  data: ContractData;
  onWriteSuccess?: (result: SendTransactionResult) => void;
};
