// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "devAutoIndex" | "notifyTransactionSuccess" | "notifyTransactionWrite";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    devAutoIndex: "TRANSACTION_SUCCESS";
    notifyTransactionSuccess: "TRANSACTION_SUCCESS";
    notifyTransactionWrite: "TRANSACTION_WRITE";
    setContractData: "TRANSACTION_READY";
    setTransactionHash: "TRANSACTION_WRITE";
    setTransactionReceipt: "TRANSACTION_SUCCESS";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "idle"
    | "transactionComplete"
    | "transactionPrepare"
    | "transactionPrepare.failure"
    | "transactionPrepare.loading"
    | "transactionReady"
    | "transactionWrite"
    | { transactionPrepare?: "failure" | "loading" };
  tags: never;
}
