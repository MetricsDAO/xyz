// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.wait-for-transaction": {
      type: "done.invoke.wait-for-transaction";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.wait-for-transaction": { type: "error.platform.wait-for-transaction"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    waitForTransaction: "done.invoke.wait-for-transaction";
  };
  missingImplementations: {
    actions: "devAutoIndex" | "notifyTransactionFailure" | "notifyTransactionSuccess" | "notifyTransactionWrite";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    devAutoIndex: "done.invoke.wait-for-transaction";
    notifyTransactionFailure: "error.platform.wait-for-transaction";
    notifyTransactionSuccess: "done.invoke.wait-for-transaction";
    notifyTransactionWrite: "TRANSACTION_WRITE";
    setContractData: "TRANSACTION_READY";
    setTransactionHash: "TRANSACTION_WRITE";
    setTransactionReceipt: "done.invoke.wait-for-transaction";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    waitForTransaction: "TRANSACTION_WRITE";
  };
  matchesStates:
    | "idle"
    | "transactionFailure"
    | "transactionPrepare"
    | "transactionPrepare.failure"
    | "transactionPrepare.loading"
    | "transactionReady"
    | "transactionSuccess"
    | "transactionWrite"
    | { transactionPrepare?: "failure" | "loading" };
  tags: never;
}
