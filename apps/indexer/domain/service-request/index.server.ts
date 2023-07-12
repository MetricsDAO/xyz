import { getAddress } from "ethers/lib/utils.js";
import invariant from "tiny-invariant";
import { z } from "zod";
import type { TracerEvent } from "@mdao/pinekit";
import { mongo, safeCreateEvent } from "@mdao/database";
import {
  ClaimToReviewEventSchema,
  ClaimToSubmitEventSchema,
  EvmAddressSchema,
  type EvmAddress,
  type RewardPool,
} from "@mdao/schema";
import { BigNumber } from "ethers";

export const indexerReviewSignalEvent = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  // log the event
  safeCreateEvent({
    name: "ReviewSignal",
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
    { $push: { "indexData.claimsToReview": { signaler: inputs.signaler, signalAmount: Number(inputs.quantity) } } }
  );
};

export const indexerRequestSignalEvent = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  // log the event
  safeCreateEvent({
    name: "RequestSignal",
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
  safeCreateEvent({
    name: "RequestWithdrawn",
    address: laborMarketAddress,
    blockNumber: event.block.number,
    transactionHash: event.txHash,
  });

  const serviceRequest = await mongo.serviceRequests.findOne({
    id: requestId,
    laborMarketAddress: laborMarketAddress as EvmAddress,
  });

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

const removeRewardPool = (existingPools: RewardPool[], pToken: EvmAddress, pTokenQuantity: string): RewardPool[] => {
  const newPools = [...existingPools];
  const pool = newPools.find((pool) => pool.pToken === pToken);
  if (pool) {
    pool.pTokenQuantity = BigNumber.from(pool.pTokenQuantity).sub(pTokenQuantity).toString();
    if (BigNumber.from(pool.pTokenQuantity).eq(0)) {
      return newPools.filter((p) => p.pToken === pToken);
    }
  }
  return newPools;
};
