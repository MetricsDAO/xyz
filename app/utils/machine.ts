import { createMachine } from "xstate";
import type { LaborMarketForm } from "~/domain";

export const blockchainMachine = createMachine(
  {
    id: "chain-write",
    initial: "idle",
    context: {
      form: {} as LaborMarketForm,
    },
    schema: {
      context: {} as { form: LaborMarketForm },
      events: {} as { type: "UPLOAD_TO_IPFS"; data: any } | { type: "TRANSACTION_READY" },
    },
    predictableActionArguments: true,
    states: {
      idle: {
        on: {
          UPLOAD_TO_IPFS: { target: "ipfsUpload" },
          TRANSACTION_READY: { target: "transactionReady" }, // Uploading to IPFS is optional
        },
      },
      ipfsUpload: {
        initial: "loading",
        invoke: {
          id: "upload-to-ipfs",
          src: (context, event) => {
            if (event.type !== "UPLOAD_TO_IPFS") {
              throw Error("Invalid event type");
            }
            return ipfsUpload(event.data);
          },
          onDone: {
            target: "transactionReady",
          },
          onError: {
            target: "ipfsUpload.failure",
          },
        },
        states: {
          loading: {},
          failure: {},
        },
      },
      transactionReady: {},
      transactionWrite: {
        entry: "notifyTransactionWrite",
      },
      transactionComplete: {
        entry: "notifyTransactionSuccess",
      },
    },
  },
  {
    actions: {
      notifyTransactionWrite: () => {
        console.log("notifyTransactionWrite");
      },
      notifyTransactionSuccess: () => {
        console.log("notifyTransactionSuccess");
      },
    },
  }
);

const ipfsUpload = (data: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.foo === "bar") {
        resolve({
          success: true,
        });
      } else {
        reject({ message: "error" });
      }
    }, 2000);
  });
};
