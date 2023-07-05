import { BigNumber } from "ethers";
import type {
  ServiceRequestAppData,
  ServiceRequestBase,
  ServiceRequestDoc,
  ServiceRequestFilter,
  ServiceRequestSearch,
} from "~/domain/service-request/schemas";
import { ServiceRequestAppDataSchema } from "~/domain/service-request/schemas";
import { fetchIpfsJson } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import type { EvmAddress } from "../address";
import type { RewardPool } from "../labor-market/schemas";

/**
 * Returns a ServiceRequestWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getServiceRequest(laborMarketAddress: EvmAddress, id: string): Promise<ServiceRequestDoc | null> {
  return await mongo.serviceRequests.findOne({ laborMarketAddress, id });
}

export async function createServiceRequest(serviceRequest: ServiceRequestBase) {
  const { id, configuration, laborMarketAddress, blockTimestamp } = serviceRequest;
  const appData = await getIndexedServiceRequestAppData(configuration.uri);

  await mongo.serviceRequests.insertOne({
    id,
    laborMarketAddress,
    blockTimestamp,
    configuration,
    appData,
    indexData: {
      indexedAt: new Date(),
      claimsToReview: [],
      claimsToSubmit: [],
      submissionCount: 0,
    },
  });
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
  const activeServiceRequests = await mongo.serviceRequests.find({
    laborMarketAddress: address,
    "configuration.enforcementExp": { $gt: new Date() },
  });

  let rewardPools: RewardPool[] = [];
  while (await activeServiceRequests.hasNext()) {
    const sr = await activeServiceRequests.next();
    if (sr) {
      rewardPools = calculateRewardPools(
        rewardPools,
        sr.configuration.pTokenProvider,
        sr.configuration.pTokenProviderTotal
      );
    }
  }

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

export const calculateRewardPools = (
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

export const removeRewardPool = (
  existingPools: RewardPool[],
  pToken: EvmAddress,
  pTokenQuantity: string
): RewardPool[] => {
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
