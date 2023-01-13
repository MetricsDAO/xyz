import { assign, createMachine } from "xstate";
import type { LaborMarketContract } from "~/domain";

export const blockchainMachine = createMachine({
  id: "chain-write",
  initial: "idle",
  context: {
    contractData: undefined,
  },
  schema: {
    context: {} as { contractData?: LaborMarketContract },
    events: {} as
      | { type: "TRANSACTION_PREPARE" }
      | { type: "TRANSACTION_READY"; data: LaborMarketContract }
      | { type: "TRANSACTION_CANCEL" }
      | { type: "TRANSACTION_WRITE" }
      | { type: "TRANSACTION_SUCCESS" },
  },
  predictableActionArguments: true,
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
          actions: assign({
            contractData: (context, event) => {
              if (event.type === "TRANSACTION_READY") {
                return event.data;
              }
            },
          }),
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
        TRANSACTION_WRITE: { target: "transactionWrite" },
      },
    },
    transactionWrite: {
      entry: "notifyTransactionWrite",
      on: {
        TRANSACTION_SUCCESS: { target: "transactionComplete" },
      },
    },
    transactionComplete: {
      entry: "notifyTransactionSuccess",
    },
  },
});
