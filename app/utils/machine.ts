import toast from "react-hot-toast";
import { assign, createMachine } from "xstate";
import type { LaborMarketContract, LaborMarketForm } from "~/domain";

export const blockchainMachine = createMachine(
  {
    id: "chain-write",
    initial: "idle",
    context: {
      formData: undefined,
      contractData: undefined,
    },
    schema: {
      context: {} as { formData?: LaborMarketForm; contractData?: LaborMarketContract },
      events: {} as
        | { type: "TRANSACTION_PREPARE"; data: LaborMarketForm }
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
          TRANSACTION_READY: { target: "transactionReady" }, // Uploading to IPFS is optional
        },
      },
      transactionPrepare: {
        initial: "loading",
        invoke: {
          id: "transaction-prepare",
          src: (context, event) => {
            if (event.type !== "TRANSACTION_PREPARE") {
              throw Error("Invalid event type");
            }
            return fetch(event.data);
          },
          onDone: {
            target: "transactionReady",
            actions: assign({
              contractData: (context, event) => {
                console.log("event", event);
                return event.data;
              },
            }),
          },
          onError: {
            target: "transactionPrepare.failure",
          },
        },
        states: {
          loading: {},
          failure: {},
        },
      },
      transactionReady: {
        entry(context, event, meta) {
          console.log("transactionReady", context.contractData);
        },
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
  },
  {
    actions: {
      notifyTransactionWrite: () => {
        toast.loading("Creating marketplace...", { id: "creating-marketplace" });
      },
      notifyTransactionSuccess: () => {
        toast.dismiss("creating-marketplace");
        toast.success("Marketplace created!");
      },
    },
  }
);

// Prepare
const fetch = (data: LaborMarketForm): Promise<LaborMarketContract> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        ...data,
        userAddress: "0x7A9260b97113B51aDf233d2fb3F006F09a329654",
        ipfsHash: "testing-hash",
      });
    }, 2000);
  });
};
