import { getAddress } from "ethers/lib/utils.js";
import { LaborMarket as LaborMarketAbi, LaborMarketNetwork as LaborMarketNetworkAbi } from "labor-markets-abi";
import * as pine from "pinekit";
import { z } from "zod";
import { upsertIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import {
  indexClaimToReview,
  indexClaimToSubmit,
  upsertIndexedServiceRequest,
} from "~/domain/service-request/functions.server";
import { indexSubmission } from "~/domain/submission/functions.server";
import env from "~/env.server";
import { logger } from "~/services/logger.server";
import { indexReview } from "~/services/review-service.server";

const worker = pine.createWorker({
  client: new pine.Client({ apiKey: env.PINE_API_KEY }),
  subscriber: env.PINE_SUBSCRIBER,
  logger: logger,
  tracer: {
    namespace: env.PINE_NAMESPACE,
    version: "1.6.0",
    blockchain: { name: "polygon", network: "mainnet" },
  },
});

const LaborMarketNetwork = worker.contract("LaborMarketNetwork", {
  addresses: [LaborMarketNetworkAbi.address],
  schema: LaborMarketNetworkAbi.abi,
});

const LaborMarket = worker.contractFromEvent("LaborMarket", {
  contract: LaborMarketNetwork,
  event: "LaborMarketCreated",
  arg: "marketAddress",
  schema: LaborMarketAbi.abi,
});

worker.onEvent(LaborMarket, "LaborMarketConfigured", async (event) => {
  upsertIndexedLaborMarket(getAddress(event.contract.address), event);
});

worker.onEvent(LaborMarket, "RequestConfigured", async (event) => {
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const laborMarketAddress = getAddress(event.contract.address);

  return upsertIndexedServiceRequest(laborMarketAddress, requestId, event);
});

worker.onEvent(LaborMarket, "ReviewSignal", async (event) => {
  return indexClaimToReview(event);
});

worker.onEvent(LaborMarket, "RequestFulfilled", async (event) => {
  return indexSubmission(event);
});

worker.onEvent(LaborMarket, "RequestSignal", async (event) => {
  return indexClaimToSubmit(event);
});

worker.onEvent(LaborMarket, "RequestReviewed", async (event) => {
  return indexReview(event);
});

worker.run();
