import { interpret } from "xstate";
import { fakeLaborMarketNew } from "~/domain";
import { blockchainMachine } from "./machine";

describe("test machine", async () => {
  test("base test", async () => {
    const service = interpret(blockchainMachine);
    service.start();
    console.log("service", service.state.value);
    service.send({ type: "TRANSACTION_PREPARE" });
    console.log("service", service.state.value);
    service.send({
      type: "TRANSACTION_READY",
      data: {
        ...fakeLaborMarketNew(),
        userAddress: "0x7A9260b97113B51aDf233d2fb3F006F09a329654",
        ipfsHash: "testing-hash",
      },
    });
    // console.log("service.status", service);
    console.log("service", service.state.value);
    // const donestate = await waitFor(service,
    // (state) => state.matches("transactionReady"));
    // console.log("service", donestate.value);
  });
});
