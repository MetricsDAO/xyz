import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { assign, createMachine } from "xstate";

type Events<ContractData> =
  | { type: "TRANSACTION_PREPARE" }
  | { type: "TRANSACTION_READY"; data: ContractData }
  | { type: "TRANSACTION_CANCEL" }
  | { type: "TRANSACTION_WRITE"; transactionHash: string }
  | { type: "TRANSACTION_SUCCESS"; transactionReceipt: TransactionReceipt };

type Context<ContractData> = {
  contractData?: ContractData;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
};

export const createBlockchainTransactionStateMachine = <T>() => {
  return createMachine(
    {
      predictableActionArguments: true, //recommended
      id: "chain-write",
      initial: "idle",
      context: {
        contractData: undefined,
        transactionHash: undefined,
        transactionReceipt: undefined,
      },
      schema: {
        context: {} as Context<T>,
        events: {} as Events<T>,
      },
      states: {
        idle: {
          on: {
            TRANSACTION_PREPARE: { target: "transactionPrepare" },
          },
        },
        transactionPrepare: {
          initial: "loading",
          on: {
            TRANSACTION_READY: {
              target: "transactionReady",
              actions: "setContractData",
            },
          },
          states: {
            loading: {},
            failure: {
              entry: "notifyTransactionPrepareFailure",
            },
          },
        },
        transactionReady: {
          on: {
            TRANSACTION_CANCEL: { target: "idle" }, //start over
            TRANSACTION_WRITE: { target: "transactionWrite", actions: "setTransactionHash" },
          },
        },
        transactionWrite: {
          entry: "notifyTransactionWrite",
          on: {
            TRANSACTION_SUCCESS: { target: "transactionComplete", actions: "setTransactionReceipt" },
          },
        },
        transactionComplete: {
          entry: ["notifyTransactionSuccess", "devAutoIndex"],
        },
      },
    },
    {
      actions: {
        setContractData: assign({
          contractData: (context, event) => {
            if (event.type === "TRANSACTION_READY") {
              return event.data;
            }
            return context.contractData;
          },
        }),
        setTransactionHash: assign({
          transactionHash: (context, event) => {
            if (event.type === "TRANSACTION_WRITE") {
              return event.transactionHash;
            }
            return context.transactionHash;
          },
        }),
        setTransactionReceipt: assign({
          transactionReceipt: (context, event) => {
            if (event.type === "TRANSACTION_SUCCESS") {
              return event.transactionReceipt;
            }
            return context.transactionReceipt;
          },
        }),
      },
    }
  );
};
