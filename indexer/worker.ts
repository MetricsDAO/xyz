import * as pine from "pinekit";
import { handleLaborMarketConfiguredEvent } from "~/domain/labor-market/functions.server";
import {
  handleRequestConfiguredEvent,
  handleRequestWithdrawnEvent,
  indexClaimToReview,
  indexClaimToSubmit,
} from "~/domain/service-request/functions.server";
import { handleRequestFulfilledEvent } from "~/domain/submission/functions.server";
import env from "~/env.server";
import { logger } from "~/services/logger.server";
import { indexReview } from "~/domain/review/functions.server";
import { getContracts } from "~/utils/contracts.server";
import { pineConfig } from "~/utils/pine-config.server";

const contracts = getContracts();
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

const LaborMarketNetwork = worker.contract("LaborMarketNetwork", {
  addresses: [contracts.LaborMarketNetwork.address],
  schema: contracts.LaborMarketNetwork.abi,
});

const LaborMarket = worker.contractFromEvent("LaborMarket", {
  contract: LaborMarketNetwork,
  event: "LaborMarketCreated",
  arg: "marketAddress",
  schema: contracts.LaborMarket.abi,
});

worker.onEvent(LaborMarket, "LaborMarketConfigured", async (event) => {
  return handleLaborMarketConfiguredEvent(event);
});

worker.onEvent(LaborMarket, "RequestConfigured", async (event) => {
  return handleRequestConfiguredEvent(event);
});

worker.onEvent(LaborMarket, "ReviewSignal", async (event) => {
  return indexClaimToReview(event);
});

worker.onEvent(LaborMarket, "RequestFulfilled", async (event) => {
  return handleRequestFulfilledEvent(event);
});

worker.onEvent(LaborMarket, "RequestSignal", async (event) => {
  return indexClaimToSubmit(event);
});

worker.onEvent(LaborMarket, "RequestReviewed", async (event) => {
  return indexReview(event);
});

worker.onEvent(LaborMarket, "RequestWithdrawn", async (event) => {
  return handleRequestWithdrawnEvent(event);
});

export { worker };
