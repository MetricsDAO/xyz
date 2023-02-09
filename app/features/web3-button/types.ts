import type { TransactionReceipt } from "@ethersproject/abstract-provider";

export type SendTransactionResult = {
  hash: `0x${string}`;
  wait: (confirmations?: number | undefined) => Promise<TransactionReceipt>;
};

// https://github.com/wagmi-dev/wagmi/discussions/233#discussioncomment-2609115
export type EthersError = Error & { reason?: string; code?: string };

export type Web3Hook<ContractData> = {
  data: ContractData;
  onWriteSuccess?: (result: SendTransactionResult) => void;
  onPrepareTransactionError?: (error: EthersError) => void;
};
