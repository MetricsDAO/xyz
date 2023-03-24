import { getAddress } from "ethers/lib/utils.js";
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
  const submissionId = z.string().parse(event.decoded.inputs.submissionId);
  const laborMarketAddress = getAddress(event.contract.address);

  return indexSubmission(laborMarketAddress, submissionId, event);
});

worker.onEvent(LaborMarket, "RequestSignal", async (event) => {
  return indexClaimToSubmit(event);
});

worker.onEvent(LaborMarket, "RequestReviewed", async (event) => {
  return indexReview(event);
});

worker.run();
