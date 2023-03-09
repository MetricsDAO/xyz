import { faker } from "@faker-js/faker";
import { BigNumber } from "ethers";
import { interpret } from "xstate";
import type { LaborMarketContract } from "~/domain";
import { fakeLaborMarketNew } from "~/domain";
import { createBlockchainTransactionStateMachine } from "./machine";
import { waitFor } from "xstate/lib/waitFor";

describe("test chain transaction machine", async () => {
  test("simple flow", async () => {
    const service = interpret(
      createBlockchainTransactionStateMachine<LaborMarketContract>().withConfig({
        actions: {
          notifyTransactionSuccess: vi.fn(),
          notifyTransactionWait: vi.fn(),
        },
      })
    );
    const { laborMarketContract, transactionHash, transactionReceipt } = fakes();

    service.start();
    expect(service.getSnapshot().value).toEqual("idle");

    // 1. Contract data is validated and ready
    service.send({
      type: "PREPARE_TRANSACTION_READY",
      data: laborMarketContract,
    });
    expect(service.getSnapshot().value).toEqual({ transactionPrepared: "ready" });
    expect(service.getSnapshot().context.contractData).equal(laborMarketContract);

    // 2. Transaction has been submitted and broadcast to chain
    service.send({
      type: "SUBMIT_TRANSACTION",
      transactionHash: transactionHash,
      transactionPromise: Promise.resolve(transactionReceipt),
    });
    expect(service.getSnapshot().value).toEqual({ transactionWait: "loading" });
    expect(service.getSnapshot().context.transactionHash).equal(transactionHash);
    expect(service.getSnapshot().actions.find((a) => a.type === "notifyTransactionWait")?.exec).toHaveBeenCalled();

    // 3. Wait for transaction to resolve to success
    await waitFor(service, (state) => state.matches({ transactionWait: "success" }));

    expect(service.getSnapshot().value).toEqual({ transactionWait: "success" });
    expect(service.getSnapshot().context.transactionReceipt).equal(transactionReceipt);
    expect(service.getSnapshot().actions.find((a) => a.type === "notifyTransactionSuccess")?.exec).toHaveBeenCalled();
  });

  test("preapprove flow", async () => {
    const service = interpret(
      createBlockchainTransactionStateMachine<LaborMarketContract>().withConfig({
        actions: {
          notifyTransactionSuccess: vi.fn(),
          notifyTransactionWait: vi.fn(),
        },
      })
    );
    const { laborMarketContract, transactionHash, transactionReceipt } = fakes();

    service.start();
    expect(service.getSnapshot().value).toEqual("idle");

    // 1. Contract data is validated and ready... but needs preapproval
    service.send({
      type: "PREPARE_TRANSACTION_PREAPPROVE",
      data: laborMarketContract,
    });
    expect(service.getSnapshot().value).toEqual({ transactionPrepared: { preapprove: "ready" } });
    expect(service.getSnapshot().context.contractData).equal(laborMarketContract);

    service.send({
      type: "SUBMIT_PREAPPROVE_TRANSACTION",
      preapproveTransactionHash: "0x123",
      preapproveTransactionPromise: Promise.resolve(transactionReceipt),
    });

    // 2. Wait for preapproval transaction to succeed
    await waitFor(service, (state) => state.matches({ transactionPrepared: { preapprove: "success" } }));
    expect(service.getSnapshot().value).toEqual({ transactionPrepared: { preapprove: "success" } });

    // 3. Transaction has been submitted and broadcast to chain
    service.send({
      type: "SUBMIT_TRANSACTION",
      transactionHash: transactionHash,
      transactionPromise: Promise.resolve(transactionReceipt),
    });
    expect(service.getSnapshot().value).toEqual({ transactionWait: "loading" });
    expect(service.getSnapshot().context.transactionHash).equal(transactionHash);
    expect(service.getSnapshot().actions.find((a) => a.type === "notifyTransactionWait")?.exec).toHaveBeenCalled();

    // 4. Wait for transaction to resolve to success
    await waitFor(service, (state) => state.matches({ transactionWait: "success" }));

    expect(service.getSnapshot().value).toEqual({ transactionWait: "success" });
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
