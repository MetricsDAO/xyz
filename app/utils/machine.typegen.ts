// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.wait-for-preapprove-transaction": {
      type: "done.invoke.wait-for-preapprove-transaction";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.wait-for-transaction": {
      type: "done.invoke.wait-for-transaction";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.wait-for-preapprove-transaction": {
      type: "error.platform.wait-for-preapprove-transaction";
      data: unknown;
    };
    "error.platform.wait-for-transaction": { type: "error.platform.wait-for-transaction"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    waitForPreapproveTransaction: "done.invoke.wait-for-preapprove-transaction";
    waitForTransaction: "done.invoke.wait-for-transaction";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    devAutoIndex: "done.invoke.wait-for-transaction";
    notifyTransactionFailure: "error.platform.wait-for-transaction";
    notifyTransactionSuccess: "done.invoke.wait-for-transaction";
    notifyTransactionWait: "SUBMIT_TRANSACTION";
    setContractData: "PREPARE_TRANSACTION_PREAPPROVE" | "PREPARE_TRANSACTION_READY";
    setTransactionHash: "SUBMIT_TRANSACTION";
    setTransactionReceipt: "done.invoke.wait-for-transaction";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    waitForPreapproveTransaction: "SUBMIT_PREAPPROVE_TRANSACTION";
    waitForTransaction: "SUBMIT_TRANSACTION";
  };
  matchesStates:
    | "idle"
    | "transactionPrepared"
    | "transactionPrepared.preapprove"
    | "transactionPrepared.preapprove.failure"
    | "transactionPrepared.preapprove.loading"
    | "transactionPrepared.preapprove.ready"
    | "transactionPrepared.preapprove.success"
    | "transactionPrepared.ready"
    | "transactionWait"
    | "transactionWait.failure"
    | "transactionWait.loading"
    | "transactionWait.success"
    | {
        transactionPrepared?: "preapprove" | "ready" | { preapprove?: "failure" | "loading" | "ready" | "success" };
        transactionWait?: "failure" | "loading" | "success";
      };
  tags: never;
}
