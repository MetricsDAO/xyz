import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { assign, createMachine } from "xstate";

type Events<T> =
  | { type: "PREPARE_TRANSACTION_READY"; data: T }
  | { type: "PREPARE_TRANSACTION_PREAPPROVE"; data: T }
  | {
      type: "SUBMIT_PREAPPROVE_TRANSACTION";
      preapproveTransactionHash: string;
      preapproveTransactionPromise: Promise<TransactionReceipt>;
    }
  | { type: "RESET_TRANSACTION" }
  | { type: "SUBMIT_TRANSACTION"; transactionHash: string; transactionPromise: Promise<TransactionReceipt> }
  | { type: "done.invoke.wait-for-transaction"; data: TransactionReceipt };

type Context<T> = {
  contractData?: T;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
};

/**
 * A state machine for managing the lifecycle of a blockchain transaction. There are 3 states, (1) idle, (2) transactionPrepared, and (3) transactionWrite.
 * The idle state is the initial state. The transactionPrepared state is entered when the user is ready to submit a transaction. The transactionWrite state is entered when the user has submitted a transaction.
 *
 * The transactionPrepared state has a substate called preapprove. This is used in cases such as when an contract requires an ERC20 transfer approval beforehand.
 * @returns a state machine
 */
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
            PREPARE_TRANSACTION_READY: {
              target: "transactionPrepared.ready",
              actions: "setContractData",
            },
            PREPARE_TRANSACTION_PREAPPROVE: {
              target: "transactionPrepared.preapprove.ready",
              actions: "setContractData",
            },
          },
        },
        transactionPrepared: {
          on: {
            RESET_TRANSACTION: { target: "idle" },
            SUBMIT_TRANSACTION: {
              target: "transactionWrite.loading",
              actions: "setTransactionHash",
              cond: (context, event, meta) =>
                meta.state.matches("transactionPrepared.ready") ||
                meta.state.matches("transactionPrepared.preapprove.success"),
            },
          },
          states: {
            ready: {},
            preapprove: {
              states: {
                ready: {
                  on: {
                    SUBMIT_PREAPPROVE_TRANSACTION: {
                      target: "loading",
                    },
                  },
                },
                loading: {
                  invoke: {
                    id: "wait-for-preapprove-transaction",
                    src: "waitForPreapproveTransaction",
                    onDone: {
                      target: "success",
                    },
                    onError: {
                      target: "failure",
                    },
                  },
                },
                success: {},
                failure: {},
              },
            },
          },
        },
        transactionWrite: {
          on: {
            RESET_TRANSACTION: { target: "idle" },
          },
          entry: "notifyTransactionWrite",
          states: {
            loading: {
              invoke: {
                id: "wait-for-transaction",
                src: "waitForTransaction",
                onDone: {
                  target: "success",
                  actions: "setTransactionReceipt",
                },
                onError: {
                  target: "failure",
                },
              },
            },
            success: {
              entry: ["notifyTransactionSuccess", "devAutoIndex"],
            },
            failure: {
              entry: ["notifyTransactionFailure"],
            },
          },
        },
      },
    },
    {
      services: {
        waitForPreapproveTransaction: (context, event) => {
          return event.preapproveTransactionPromise;
        },
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
        // noop to make these optional when useMachine
        notifyTransactionWrite: () => {},
        notifyTransactionSuccess: () => {},
        notifyTransactionFailure: () => {},
        devAutoIndex: () => {},
      },
    }
  );
};
