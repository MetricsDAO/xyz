import * as pine from "@mdao/pinekit";
import { indexerRequestReviewedEvent } from "domain/review/index.server";
import { indexerRequestPayClaimedEvent } from "domain/reward/index.server";
import {
  indexerRequestSignalEvent,
  indexerRequestWithdrawnEvent,
  indexerReviewSignalEvent,
} from "domain/service-request/index.server";
import env from "../env";
import {
  EvmAddressSchema,
  LaborMarketConfigSchema,
  ServiceRequestConfigSchema,
  SubmissionConfigSchema,
} from "@mdao/schema";
import { indexLaborMarketEvent, indexServiceRequestEvent, indexSubmissionEvent, pineConfig } from "@mdao/database";
import { contractsByEnv } from "@mdao/contracts";
import { logger } from "./logger";

const contracts = contractsByEnv(env.ENVIRONMENT === "development");
const config = pineConfig();

const worker = pine.createWorker({
  client: new pine.Client({ apiKey: env.PINE_API_KEY }),
  subscriber: config.subscriber,
  logger: logger,
  tracer: {
    namespace: config.namespace,
    version: config.version,
    blockchain: { name: "polygon", network: "mainnet" },
  },
});

const LaborMarketFactory = worker.contract("LaborMarketFactory", {
  addresses: [contracts.LaborMarketFactory.address],
  schema: contracts.LaborMarketFactory.abi,
});

const LaborMarket = worker.contractFromEvent("LaborMarket", {
  contract: LaborMarketFactory,
  event: "LaborMarketCreated",
  arg: "marketAddress",
  schema: contracts.LaborMarket.abi,
});

worker.onEvent(LaborMarket, "LaborMarketConfigured", async (event) => {
  const address = EvmAddressSchema.parse(event.contract.address);
  const inputs = LaborMarketConfigSchema.parse(event.decoded.inputs);
  return indexLaborMarketEvent({
    name: "LaborMarketConfigured",
    address,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: inputs,
  });
});

worker.onEvent(LaborMarket, "RequestConfigured", async (event) => {
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const config = ServiceRequestConfigSchema.parse(event.decoded.inputs);
  return indexServiceRequestEvent({
    name: "RequestConfigured",
    address: laborMarketAddress,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: config,
  });
});

worker.onEvent(LaborMarket, "ReviewSignal", async (event) => {
  return indexerReviewSignalEvent(event);
});

worker.onEvent(LaborMarket, "RequestFulfilled", async (event) => {
  const config = SubmissionConfigSchema.parse(event.decoded.inputs);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);

  // create submission
  return indexSubmissionEvent({
    name: "RequestFulfilled",
    address: laborMarketAddress,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: config,
  });
});

worker.onEvent(LaborMarket, "RequestSignal", async (event) => {
  return indexerRequestSignalEvent(event);
});

worker.onEvent(LaborMarket, "RequestReviewed", async (event) => {
  return indexerRequestReviewedEvent(event);
});

worker.onEvent(LaborMarket, "RequestWithdrawn", async (event) => {
  return indexerRequestWithdrawnEvent(event);
});

worker.onEvent(LaborMarket, "RequestPayClaimed", async (event) => {
  return indexerRequestPayClaimedEvent(event);
});

export { worker };
