import type { User } from "@prisma/client";
import { BigNumber } from "ethers";
import type { TracerEvent } from "pinekit/types";
import { LaborMarket__factory } from "~/contracts";
import type { LaborMarketDoc } from "~/domain";
import { ClaimToReviewEventSchema, ClaimToSubmitEventSchema } from "~/domain";
import type {
  ServiceRequestAppData,
  ServiceRequestIndexData,
  ServiceRequestSearch,
  ServiceRequestWithIndexData,
} from "~/domain/service-request/schemas";
import {
  ServiceRequestAppDataSchema,
  ServiceRequestConfigSchema,
  ServiceRequestWithIndexDataSchema,
} from "~/domain/service-request/schemas";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import type { LaborMarketWithIndexData } from "../labor-market/schemas";

/**
 * Returns a ServiceRequestWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedServiceRequest(address: EvmAddress, id: string): Promise<ServiceRequestWithIndexData> {
  const doc = await mongo.serviceRequests.findOne({ id, laborMarketAddress: address });
  if (!doc) {
    await upsertIndexedServiceRequest(address, id);
    return getIndexedServiceRequest(address, id);
  }
  console.log("DOC", doc);
  return ServiceRequestWithIndexDataSchema.parse(doc);
}

/**
 * Creates a ServiceRequesttWithIndexData in mongodb from chain and ipfs data.
 */
export async function upsertIndexedServiceRequest(laborMarketAddress: EvmAddress, id: string, event?: TracerEvent) {
  const configuration = await getServiceRequestConfig(laborMarketAddress, id);
  let appData;
  try {
    appData = await getIndexedServiceRequestAppData(configuration.uri);
  } catch (e) {
    logger.warn(
      `Failed to fetch and parse service request app data for ${laborMarketAddress}. Id: ${id} Skipping indexing.`,
      e
    );
    return;
  }
  const serviceRequest = { id, laborMarketAddress, configuration, appData };
  const indexData: ServiceRequestIndexData = {
    createdAtBlockTimestamp: event?.block.timestamp ? new Date(event.block.timestamp) : new Date(),
    indexedAt: new Date(),
    claimsToReview: [],
    claimsToSubmit: [],
    submissionCount: 0,
    valid: true,
  };

  const lm = await mongo.laborMarkets.findOne({ address: serviceRequest.laborMarketAddress });

  await mongo.laborMarkets.updateOne(
    { address: serviceRequest.laborMarketAddress },
    {
      $inc: {
        "indexData.serviceRequestCount": 1,
      },
      $set: {
        "indexData.serviceRequest.rewardPools": calculateRewardPools(
          lm?.indexData.serviceRequestRewardPools ?? [],
          serviceRequest.configuration.pToken,
          serviceRequest.configuration.pTokenQ
        ),
      },
    }
  );

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: serviceRequest.laborMarketAddress, id: serviceRequest.id },
    {
      $set: serviceRequest,
      $setOnInsert: {
        submissionCount: 0,
        claimsToSubmit: [],
        claimsToReview: [],
        createdAtBlockTimestamp: indexData.createdAtBlockTimestamp,
      },
    },
    { upsert: true }
  );
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
 * Returns an array of ServiceRequestDoc for a given Service Request.
 */
export const searchServiceRequests = async (params: ServiceRequestSearch) => {
  return mongo.serviceRequests
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of ServiceRequests that match a given ServiceRequestSearch.
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns {number} - The number of service requests that match the search.
 */
export const countServiceRequests = async (params: ServiceRequestSearch) => {
  return mongo.serviceRequests.countDocuments(searchParams(params));
};

/**
 * Convenience function to share the search parameters between search and count.
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: ServiceRequestSearch): Parameters<typeof mongo.serviceRequests.find>[0] => {
  return {
    valid: true,
    ...(params.laborMarket ? { laborMarketAddress: params.laborMarket as `0x${string}` } : {}),
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
    ...(params.language ? { "appData.language": { $in: params.language } } : {}),
    ...(params.project ? { "appData.projectSlugs": { $in: params.project } } : {}),
  };
};

/**
 * Finds a ServiceRequest by its ID.
 * @param {String} id - The ID of the Challenge.
 * @returns - The ServiceRequest or null if not found.
 */
export const findServiceRequest = async (id: string, laborMarketAddress: string) => {
  return mongo.serviceRequests.findOne({ id, laborMarketAddress: laborMarketAddress as `0x${string}`, valid: true });
};

export const indexClaimToReview = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: event.contract.address as `0x${string}`, id: inputs.requestId },
    { $push: { claimsToReview: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }
  );
};

export const indexClaimToSubmit = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: event.contract.address as `0x${string}`, id: inputs.requestId },
    { $push: { claimsToSubmit: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }
  );
};

const calculateRewardPools = (
  existingPools: LaborMarketWithIndexData["indexData"]["serviceRequestRewardPools"],
  pToken: string,
  pTokenQuantity: string
) => {
  const newPools = [...existingPools];
  const pool = newPools.find((pool) => pool.pToken === pToken);
  if (pool) {
    pool.pTokenQuantity = BigNumber.from(pool.pTokenQuantity).add(pTokenQuantity).toString();
  } else {
    newPools.push({
      pToken: pToken as `0x${string}`,
      pTokenQuantity: pTokenQuantity,
    });
  }
  return newPools;
};
