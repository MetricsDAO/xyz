import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import { EvmAddressSchema } from "../address";
import { createEvent, safeCreateEvent } from "../event/functions.server";
import type { Event } from "../event/schema";
import {
  calculateRewardPools,
  createServiceRequest,
  findServiceRequest,
  getServiceRequest,
  removeRewardPool,
} from "./functions.server";
import type { ServiceRequestConfig } from "./schemas";
import { ServiceRequestConfigSchema } from "./schemas";
import { ClaimToReviewEventSchema } from "../claim-to-review";
import { getAddress } from "ethers/lib/utils.js";
import { ClaimToSubmitEventSchema } from "../claim-to-submit";
import { z } from "zod";
import { fromUnixTimestamp } from "~/utils/date";

const BLOCK_LOOK_BACK = -150; // Look back 150 blocks (~5 minutes on Polygon)

export async function appRequestConfiguredEvent(event: Event) {
  const { blockNumber, transactionHash, address } = event;
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.RequestConfigured();
  const events = await contract.queryFilter(eventFilter, BLOCK_LOOK_BACK);
  for (const e of events) {
    if (e.blockNumber === blockNumber && e.transactionHash === transactionHash) {
      const block = await e.getBlock();
      const args = ServiceRequestConfigSchema.parse({
        ...e.args,
        pTokenProviderTotal: e.args.pTokenProviderTotal.toString(),
        pTokenReviewerTotal: e.args.pTokenReviewerTotal.toString(),
        requestId: e.args.requestId.toString(),
        providerLimit: e.args.providerLimit.toNumber(),
        reviewerLimit: e.args.reviewerLimit.toNumber(),
      });
      await indexServiceRequestEvent({
        address,
        blockNumber,
        blockTimestamp: fromUnixTimestamp(block.timestamp),
        transactionHash,
        args,
      });
      return;
    }
  }
}

export async function indexerRequestConfiguredEvent(event: TracerEvent) {
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const config = ServiceRequestConfigSchema.parse(event.decoded.inputs);
  await indexServiceRequestEvent({
    address: laborMarketAddress,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: config,
  });
}

/**
 * This where "indexing" the service request into our DB happens. Different event and input types from different systems should be coalesced into this function.
 * This function guards against duplicate events (race conditions) by utilizing "safeCreateEvent"
 * @param event the standardized event
 * @returns
 */
async function indexServiceRequestEvent(event: {
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: ServiceRequestConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    logger.info("Already seen a similar event. Skipping indexing.");
    return;
  }
  await createServiceRequest({
    id: event.args.requestId,
    laborMarketAddress: event.address,
    blockTimestamp: event.blockTimestamp,
    configuration: event.args,
  });
  const sr = await getServiceRequest(event.address, event.args.requestId);
  invariant(sr, "Service request should exist after creation");

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "ServiceRequest",
    eventType: {
      eventType: "RequestConfigured",
      config: {
        laborMarketAddress: sr.laborMarketAddress,
        requestId: sr.id,
        title: sr.appData.title,
      },
    },
    iconType: "service-request",
    actionName: "Launch Challenge",
    userAddress: sr.configuration.requester,
    blockTimestamp: sr.blockTimestamp,
    indexedAt: sr.indexData.indexedAt,
  });

  // Update labor market
  const lm = await mongo.laborMarkets.findOne({ address: sr.laborMarketAddress });
  const rewardPools = calculateRewardPools(
    lm?.indexData.serviceRequestRewardPools ?? [],
    sr.configuration.pTokenProvider,
    sr.configuration.pTokenProviderTotal
  );

  await mongo.laborMarkets.updateOne(
    { address: sr.laborMarketAddress },
    {
      $inc: {
        "indexData.serviceRequestCount": 1,
      },
      $set: {
        "indexData.serviceRequestRewardPools": rewardPools,
      },
    }
  );
}

export const indexerReviewSignalEvent = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  // log the event
  createEvent({
    address: laborMarketAddress,
    blockNumber: event.block.number,
    transactionHash: event.txHash,
    args: inputs,
  });

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress: laborMarketAddress,
    id: inputs.requestId,
  });

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "Review",
    eventType: {
      eventType: "ReviewSignal",
      config: {
        laborMarketAddress: laborMarketAddress,
        requestId: inputs.requestId,
        title: serviceRequest?.appData.title ?? "",
      },
    },
    iconType: "review",
    actionName: "Claim to Review",
    userAddress: inputs.signaler,
    blockTimestamp: new Date(event.block.timestamp),
    indexedAt: new Date(),
  });

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress, id: inputs.requestId },
    { $push: { "indexData.claimsToReview": { signaler: inputs.signaler, signalAmount: inputs.quantity } } }
  );
};

export const indexerRequestSignalEvent = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  // log the event
  createEvent({
    address: laborMarketAddress,
    blockNumber: event.block.number,
    transactionHash: event.txHash,
    args: inputs,
  });

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress: laborMarketAddress,
    id: inputs.requestId,
  });

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "Submission",
    eventType: {
      eventType: "RequestSignal",
      config: {
        laborMarketAddress: laborMarketAddress,
        requestId: inputs.requestId,
        title: serviceRequest?.appData.title ?? "",
      },
    },
    iconType: "submission",
    actionName: "Claim to Submit",
    userAddress: inputs.signaler,
    blockTimestamp: new Date(event.block.timestamp),
    indexedAt: new Date(),
  });

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: laborMarketAddress, id: inputs.requestId },
    { $push: { "indexData.claimsToSubmit": { signaler: inputs.signaler } } }
  );
};

export async function indexerRequestWithdrawnEvent(event: TracerEvent) {
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);

  // log the event
  createEvent({
    address: laborMarketAddress,
    blockNumber: event.block.number,
    transactionHash: event.txHash,
  });

  const serviceRequest = await findServiceRequest(requestId, laborMarketAddress);

  invariant(serviceRequest, "Service request should exist");
  //log this event in user activity collection
  mongo.userActivity.insertOne({
    groupType: "ServiceRequest",
    eventType: {
      eventType: "RequestWithdrawn",
      config: {
        laborMarketAddress: serviceRequest.laborMarketAddress,
        requestId: serviceRequest.id,
        title: serviceRequest.appData.title,
      },
    },
    iconType: "service-request",
    actionName: "Delete Challenge",
    userAddress: serviceRequest.configuration.requester,
    blockTimestamp: new Date(event.block.timestamp),
    indexedAt: new Date(),
  });

  // Update labor market
  const lm = await mongo.laborMarkets.findOne({ address: serviceRequest.laborMarketAddress });
  const rewardPools = removeRewardPool(
    lm?.indexData.serviceRequestRewardPools ?? [],
    serviceRequest.configuration.pTokenProvider,
    serviceRequest.configuration.pTokenProviderTotal
  );

  await mongo.laborMarkets.updateOne(
    { address: serviceRequest.laborMarketAddress },
    {
      $inc: {
        "indexData.serviceRequestCount": -1,
      },
      $set: {
        "indexData.serviceRequestRewardPools": rewardPools,
      },
    }
  );

  await mongo.serviceRequests.deleteOne({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    id: serviceRequest.id,
  });
}
