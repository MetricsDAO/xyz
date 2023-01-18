import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { assign, createMachine } from "xstate";

type Events<T> =
  | { type: "TRANSACTION_PREPARE" }
  | { type: "TRANSACTION_READY"; data: T }
  | { type: "TRANSACTION_CANCEL" }
  | {
      type: "TRANSACTION_WRITE";
      transactionHash: string;
      transactionPromise: Promise<TransactionReceipt>;
    }
  | { type: "done.invoke.wait-for-transaction"; data: TransactionReceipt }
  | { type: "TRANSACTION_SUCCESS"; transactionReceipt: TransactionReceipt }
  | { type: "TRANSACTION_FAILURE" };

type Context<T> = {
  contractData?: T;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
};

export const createBlockchainTransactionStateMachine = <T>() => {
  return createMachine(
    {
      // tsTypes is auto-generated with xstate VSCODE extension
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      tsTypes: {} as import("./machine.typegen").Typegen0,
      predictableActionArguments: true, //recommended
      id: "blockchain-transaction-machine",
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
            failure: {},
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
          invoke: {
            id: "wait-for-transaction",
            src: "waitForTransaction",
            onDone: {
              target: "transactionSuccess",
              actions: "setTransactionReceipt",
            },
            onError: {
              target: "transactionFailure",
            },
          },
        },
        transactionSuccess: {
          entry: ["notifyTransactionSuccess", "devAutoIndex"],
        },
        transactionFailure: {
          entry: ["notifyTransactionFailure"],
        },
      },
    },
    {
      services: {
        waitForTransaction: (context, event) => {
          return event.transactionPromise;
        },
      },
      actions: {
        setContractData: assign({
          contractData: (context, event) => {
            return event.data;
          },
        }),
        setTransactionHash: assign({
          transactionHash: (context, event) => {
            return event.transactionHash;
          },
        }),
        setTransactionReceipt: assign({
          transactionReceipt: (context, event) => {
            return event.data;
          },
        }),
      },
    }
  );
};
