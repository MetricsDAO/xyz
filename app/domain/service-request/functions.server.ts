import type { User } from "@prisma/client";
import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import { ClaimToReviewEventSchema, ClaimToSubmitEventSchema } from "~/domain";
import type {
  ServiceRequestAppData,
  ServiceRequestFilter,
  ServiceRequestIndexData,
  ServiceRequestSearch,
  ServiceRequestWithIndexData,
} from "~/domain/service-request/schemas";
import { ServiceRequestAppDataSchema, ServiceRequestConfigSchema } from "~/domain/service-request/schemas";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import { EvmAddressSchema } from "../address";
import type { RewardPool } from "../labor-market/schemas";

/**
 * Returns a ServiceRequestWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedServiceRequest(address: EvmAddress, id: string): Promise<ServiceRequestWithIndexData> {
  const doc = await mongo.serviceRequests.findOne({ id, laborMarketAddress: address });
  if (!doc) {
    const newDoc = await upsertIndexedServiceRequest(address, id);
    invariant(newDoc, "Service request should have been indexed");
    return newDoc;
  }
  return doc;
}

export async function handleRequestConfiguredEvent(event: TracerEvent) {
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const serviceRequest = await upsertIndexedServiceRequest(laborMarketAddress, requestId, event);
  if (!serviceRequest) {
    logger.warn("Service request was not indexed", { requestId, laborMarketAddress });
    return;
  }

  invariant(serviceRequest.blockTimestamp, "Service request should have a block timestamp");
  //log this event in user activity collection
  mongo.userActivity.insertOne({
    groupType: "ServiceRequest",
    eventType: {
      eventType: "RequestConfigured",
      config: {
        laborMarketAddress: serviceRequest.laborMarketAddress,
        requestId: serviceRequest.id,
        title: serviceRequest.appData.title,
      },
    },
    iconType: "service-request",
    actionName: "Launch Challenge",
    userAddress: serviceRequest.configuration.serviceRequester,
    blockTimestamp: serviceRequest.blockTimestamp,
    indexedAt: serviceRequest.indexedAt,
  });

  // Update labor market
  const lm = await mongo.laborMarkets.findOne({ address: serviceRequest.laborMarketAddress });
  const rewardPools = calculateRewardPools(
    lm?.indexData.serviceRequestRewardPools ?? [],
    serviceRequest.configuration.pToken,
    serviceRequest.configuration.pTokenQ
  );

  await mongo.laborMarkets.updateOne(
    { address: serviceRequest.laborMarketAddress },
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

export async function handleRequestWithdrawnEvent(event: TracerEvent) {
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const serviceRequest = await findServiceRequest(requestId, laborMarketAddress);
  if (!serviceRequest) {
    logger.warn("Service request was not found", { requestId, laborMarketAddress });
    return;
  }

  invariant(serviceRequest.blockTimestamp, "Service request should have a block timestamp");
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
    userAddress: serviceRequest.configuration.serviceRequester,
    blockTimestamp: serviceRequest.blockTimestamp,
    indexedAt: serviceRequest.indexedAt,
  });
  logger.info("Added to activity");

  // Update labor market
  const lm = await mongo.laborMarkets.findOne({ address: serviceRequest.laborMarketAddress });
  const rewardPools = removeRewardPool(
    lm?.indexData.serviceRequestRewardPools ?? [],
    serviceRequest.configuration.pToken,
    serviceRequest.configuration.pTokenQ
  );

  await mongo.laborMarkets.updateOne(
    { address: serviceRequest.laborMarketAddress },
    {
      $dec: {
        "indexData.serviceRequestCount": 1,
      },
      $set: {
        "indexData.serviceRequestRewardPools": rewardPools,
      },
    }
  );
  logger.info("Updated lm");

  await mongo.serviceRequests.deleteOne({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    id: serviceRequest.id,
    blockTimestamp: serviceRequest.blockTimestamp,
    indexedAt: serviceRequest.indexedAt,
  });
  logger.info("Removed");
}

/**
 * Creates a ServiceRequesttWithIndexData in mongodb from chain and ipfs data.
 */
export async function upsertIndexedServiceRequest(
  laborMarketAddress: EvmAddress,
  id: string,
  event?: TracerEvent
): Promise<ServiceRequestWithIndexData | null> {
  const configuration = await getServiceRequestConfig(laborMarketAddress, id);
  let appData;
  try {
    appData = await getIndexedServiceRequestAppData(configuration.uri);
  } catch (e) {
    logger.warn(
      `Failed to fetch and parse service request app data for ${laborMarketAddress}. Id: ${id} Skipping indexing.`,
      e
    );
    return null;
  }
  const serviceRequest = {
    id,
    laborMarketAddress,
    configuration,
    appData,
    blockTimestamp: event?.block.timestamp ? new Date(event.block.timestamp) : undefined,
  };
  const indexData: ServiceRequestIndexData = {
    indexedAt: new Date(),
    claimsToReview: [],
    claimsToSubmit: [],
    submissionCount: 0,
  };

  const res = await mongo.serviceRequests.findOneAndUpdate(
    { laborMarketAddress: serviceRequest.laborMarketAddress, id: serviceRequest.id },
    {
      $set: serviceRequest,
      $setOnInsert: indexData,
    },
    { upsert: true, returnDocument: "after" }
  );

  return res.value;
}

/**
 * Uploads a ServiceRequestAppData object to IPFS and returns the CID.
 */
export async function createServiceRequestAppData(appData: ServiceRequestAppData, user: User) {
  const cid = await uploadJsonToIpfs(user, appData, appData.title);
  return cid;
}

async function getServiceRequestConfig(address: string, id: string) {
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const data = await contract.serviceRequests(id);
  return ServiceRequestConfigSchema.parse(data);
}

async function getIndexedServiceRequestAppData(marketUri: string): Promise<ServiceRequestAppData> {
  const data = await fetchIpfsJson(marketUri);
  return ServiceRequestAppDataSchema.parse(data);
}

/**
 * Counts the number of ServiceRequests that match a given ServiceRequestFilter.
 */
export function countServiceRequests(filter: ServiceRequestFilter) {
  return mongo.serviceRequests.countDocuments(filterToMongo(filter));
}

/**
 * Counts the number of ServiceRequests that are active for a given laborMarket.
 */
export function countActiveServiceRequests(address: EvmAddress) {
  const currDate = new Date();
  return mongo.serviceRequests.countDocuments({
    laborMarketAddress: address,
    "configuration.enforcementExp": { $gt: currDate },
  });
}

/**
 * Counts the reward pool totals of ServiceRequests that are active for a given laborMarket.
 */
export async function getActiveRewardPools(address: EvmAddress) {
  const activeServiceRequests = mongo.serviceRequests.find({
    laborMarketAddress: address,
    "configuration.enforcementExp": { $gt: new Date() },
  });

  let rewardPools: RewardPool[] = [];

  await activeServiceRequests.forEach((sr) => {
    rewardPools = calculateRewardPools(rewardPools, sr.configuration.pToken, sr.configuration.pTokenQ);
  });

  return rewardPools;
}

/**
 * Returns an array of LaborMarketsWithIndexData for a given LaborMarketSearch.
 */
export function searchServiceRequests(search: ServiceRequestSearch) {
  return mongo.serviceRequests
    .find(filterToMongo(search))
    .sort({ [search.sortBy]: search.order === "asc" ? 1 : -1 })
    .skip(search.first * (search.page - 1))
    .limit(search.first)
    .toArray();
}

/**
 * Convenience function to share the search parameters between search and count.
 * @returns criteria to find labor market in MongoDb
 */
function filterToMongo(filter: ServiceRequestFilter): Parameters<typeof mongo.serviceRequests.find>[0] {
  return {
    ...(filter.q ? { $text: { $search: filter.q, $language: "english" } } : {}),
    ...(filter.project ? { "appData.projectSlugs": { $in: filter.project } } : {}),
    ...(filter.laborMarket ? { laborMarketAddress: filter.laborMarket as `0x${string}` } : {}),
    ...(filter.token ? { "configuration.pToken": { $in: filter.token } } : {}),
  };
}

/**
 * Finds a ServiceRequest by its ID.
 * @param {String} id - The ID of the Challenge.
 * @returns - The ServiceRequest or null if not found.
 */
export const findServiceRequest = async (id: string, laborMarketAddress: string) => {
  return mongo.serviceRequests.findOne({ id, laborMarketAddress: laborMarketAddress as EvmAddress });
};

export const indexClaimToReview = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress: laborMarketAddress,
    id: inputs.requestId,
  });

  //log this event in user activity collection
  mongo.userActivity.insertOne({
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
    { $push: { claimsToReview: { signaler: inputs.signaler, signalAmount: +inputs.signalAmount } } }
  );
};

export const indexClaimToSubmit = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);
  const laborMarketAddress = getAddress(event.contract.address);

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress: laborMarketAddress,
    id: inputs.requestId,
  });

  //log this event in user activity collection
  mongo.userActivity.insertOne({
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
    { $push: { claimsToSubmit: { signaler: inputs.signaler, signalAmount: +inputs.signalAmount } } }
  );
};

const calculateRewardPools = (
  existingPools: RewardPool[],
  pToken: EvmAddress,
  pTokenQuantity: string
): RewardPool[] => {
  const newPools = [...existingPools];
  const pool = newPools.find((pool) => pool.pToken === pToken);
  if (pool) {
    pool.pTokenQuantity = BigNumber.from(pool.pTokenQuantity).add(pTokenQuantity).toString();
  } else {
    newPools.push({
      pToken: pToken,
      pTokenQuantity: pTokenQuantity,
    });
  }
  return newPools;
};

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
