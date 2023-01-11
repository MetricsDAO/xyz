import { interpret } from "xstate";
import { blockchainMachine } from "./machine";
import { waitFor } from "xstate/lib/waitFor";
import { fakeLaborMarketNew } from "~/domain";

describe("test machine", async () => {
  test("base test", async () => {
    const service = interpret(blockchainMachine);
    service.start();
    console.log("service", service.state.value);
    service.send({ type: "TRANSACTION_PREPARE", data: fakeLaborMarketNew({}) });
    const donestate = await waitFor(service, (state) => state.matches("transactionReady"));
    console.log("service", donestate.value);
  });
});
