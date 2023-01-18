// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.chain-write.transactionWrite:invocation[0]": {
      type: "done.invoke.chain-write.transactionWrite:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.chain-write.transactionWrite:invocation[0]": {
      type: "error.platform.chain-write.transactionWrite:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "devAutoIndex" | "notifyTransactionFailure" | "notifyTransactionSuccess" | "notifyTransactionWrite";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    devAutoIndex: "done.invoke.chain-write.transactionWrite:invocation[0]";
    notifyTransactionFailure: "error.platform.chain-write.transactionWrite:invocation[0]";
    notifyTransactionSuccess: "done.invoke.chain-write.transactionWrite:invocation[0]";
    notifyTransactionWrite: "TRANSACTION_WRITE";
    setContractData: "TRANSACTION_READY";
    setTransactionHash: "TRANSACTION_WRITE";
    setTransactionReceipt: "done.invoke.chain-write.transactionWrite:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
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
