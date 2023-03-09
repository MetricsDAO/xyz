import type { User } from "@prisma/client";
import { LaborMarket__factory } from "~/contracts";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import type {
  LaborMarket,
  LaborMarketAppData,
  LaborMarketFilter,
  LaborMarketIndexData,
  LaborMarketSearch,
  LaborMarketWithIndexData,
} from "./schemas";
import { LaborMarketAppDataSchema, LaborMarketConfigSchema, LaborMarketWithIndexDataSchema } from "./schemas";

/**
 * Gets a LaborMarketConfig from chain and ipfs. Returns undefined if the contract doesn't exist.
 */
export async function getChainLaborMarket(address: EvmAddress, block?: number): Promise<LaborMarket> {
  const configuration = await getLaborMarketConfig(address, block);
  const appData = await getLaborMarketAppData(configuration.marketUri);
  return { address, configuration, appData };
}

/**
 * Returns a LaborMarketWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedLaborMarket(address: EvmAddress): Promise<LaborMarketWithIndexData> {
  const doc = await mongo.laborMarkets.findOne({ address });
  if (!doc) {
    await upsertIndexedLaborMarket(address);
    return getIndexedLaborMarket(address);
  }
  return LaborMarketWithIndexDataSchema.parse(doc);
}

/**
 * Creates a LaborMarketWithIndexData in mongodb from chain and ipfs data.
 */
export async function upsertIndexedLaborMarket(address: EvmAddress, block?: number) {
  const laborMarket = await getChainLaborMarket(address, block);
  const indexData: LaborMarketIndexData = {
    valid: LaborMarketAppDataSchema.safeParse(laborMarket.appData).success,
    indexedAt: new Date(),
    serviceRequestCount: 0,
    serviceRequestRewardPools: [],
    createdAtBlockTimestamp: new Date(),
  };
  return mongo.laborMarkets.updateOne(
    { address },
    { $set: laborMarket, $setOnInsert: { indexData } },
    { upsert: true }
  );
}

/**
 * Uploads a LaborMarketAppData object to IPFS and returns the CID.
 */
export async function createLaborMarketAppData(appData: LaborMarketAppData, user: User) {
  const cid = await uploadJsonToIpfs(user, appData, appData.title);
  return cid;
}

/**
 * Counts the number of LaborMarkets that match a given LaborMarketSearch.
 */
export function countLaborMarkets(filter: LaborMarketFilter) {
  return mongo.laborMarkets.countDocuments(filterToMongo(filter));
}

/**
 * Returns an array of LaborMarketsWithIndexData for a given LaborMarketSearch.
 */
export function searchLaborMarkets(search: LaborMarketSearch) {
  return mongo.laborMarkets
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
function filterToMongo(filter: LaborMarketFilter): Parameters<typeof mongo.laborMarkets.find>[0] {
  return {
    "appData.type": filter.type,
    ...(filter.q ? { $text: { $search: filter.q, $language: "english" } } : {}),
    ...(filter.project ? { "appData.projectSlugs": { $in: filter.project } } : {}),
    ...(filter.token ? { serviceRequestRewardPools: { $elemMatch: { pToken: { $in: filter.token } } } } : {}),
  };
}

async function getLaborMarketConfig(address: string, block?: number) {
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const data = await contract.configuration();
  return LaborMarketConfigSchema.parse(data);
}

async function getLaborMarketAppData(marketUri: string): Promise<LaborMarketAppData> {
  const data = await fetchIpfsJson(marketUri);
  return LaborMarketAppDataSchema.parse(data);
}
