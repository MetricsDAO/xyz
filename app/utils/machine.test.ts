import { faker } from "@faker-js/faker";
import { BigNumber } from "ethers";
import { interpret } from "xstate";
import type { LaborMarketContract } from "~/domain";
import { fakeLaborMarketNew } from "~/domain";
import { createBlockchainTransactionStateMachine } from "./machine";
import { waitFor } from "xstate/lib/waitFor";

describe("test chain transaction machine", async () => {
  test("happy path", async () => {
    const service = interpret(
      createBlockchainTransactionStateMachine<LaborMarketContract>().withConfig({
        actions: {
          notifyTransactionWrite: vi.fn(),
          notifyTransactionSuccess: vi.fn(),
          notifyTransactionFailure: vi.fn(),
          devAutoIndex: vi.fn(),
        },
      })
    );
    const { laborMarketContract, transactionHash, transactionReceipt } = fakes();

    service.start();
    expect(service.getSnapshot().value).toEqual("idle");

    service.send({ type: "TRANSACTION_PREPARE" });
    expect(service.getSnapshot().value).toEqual({ transactionPrepare: "loading" });

    service.send({
      type: "TRANSACTION_READY",
      data: laborMarketContract,
    });
    expect(service.getSnapshot().value).toEqual("transactionReady");
    expect(service.getSnapshot().context.contractData).equal(laborMarketContract);

    service.send({
      type: "TRANSACTION_WRITE",
      transactionHash: transactionHash,
      transactionPromise: Promise.resolve(transactionReceipt),
    });
    expect(service.getSnapshot().value).toEqual("transactionWrite");
    expect(service.getSnapshot().context.transactionHash).equal(transactionHash);
    expect(service.getSnapshot().actions.find((a) => a.type === "notifyTransactionWrite")?.exec).toHaveBeenCalled();

    await waitFor(service, (state) => state.matches("transactionSuccess"));

    expect(service.getSnapshot().value).toEqual("transactionSuccess");
    expect(service.getSnapshot().context.transactionReceipt).equal(transactionReceipt);
    expect(service.getSnapshot().actions.find((a) => a.type === "notifyTransactionSuccess")?.exec).toHaveBeenCalled();
  });
});

const fakes = () => {
  const laborMarketContract = {
    ...fakeLaborMarketNew(),
    userAddress: faker.finance.ethereumAddress(),
    ipfsHash: "testing-hash",
  };
  const transactionHash = faker.finance.ethereumAddress();
  const transactionReceipt = {
    to: faker.finance.ethereumAddress(),
    from: faker.finance.ethereumAddress(),
    contractAddress: faker.finance.ethereumAddress(),
    transactionIndex: faker.datatype.number(),
    root: faker.datatype.string(),
    gasUsed: BigNumber.from(faker.datatype.number()),
    logsBloom: faker.datatype.string(),
    blockHash: faker.datatype.string(),
    transactionHash: faker.datatype.string(),
    logs: [],
    blockNumber: faker.datatype.number(),
    confirmations: faker.datatype.number(),
    cumulativeGasUsed: BigNumber.from(faker.datatype.number()),
    effectiveGasPrice: BigNumber.from(faker.datatype.number()),
    byzantium: faker.datatype.boolean(),
    type: faker.datatype.number(),
    status: faker.datatype.number(),
  };

  return {
    laborMarketContract,
    transactionHash,
    transactionReceipt,
  };
};
