import { fetchIpfsJson } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import type { EvmAddress } from "../address";
import type {
  LaborMarketAppData,
  LaborMarketBase,
  LaborMarketDoc,
  LaborMarketFilter,
  LaborMarketSearch,
} from "./schemas";
import { LaborMarketAppDataSchema } from "./schemas";

export async function getLaborMarket(address: EvmAddress): Promise<LaborMarketDoc | null> {
  return await mongo.laborMarkets.findOne({ address });
}

async function getLaborMarketAppData(marketUri: string): Promise<LaborMarketAppData> {
  const data = await fetchIpfsJson(marketUri);
  return LaborMarketAppDataSchema.parse(data);
}

/**
 * Creates a LaborMarketWithIndexData in mongodb from chain and ipfs data.
 * @param address
 * @param blockTimestamp
 * @param configuration
 * @throws {Error} if IPFS data is invalid
 */
export async function createLaborMarket(laborMarket: LaborMarketBase) {
  const { configuration, address, blockTimestamp } = laborMarket;
  const appData = await getLaborMarketAppData(configuration.uri);

  await mongo.laborMarkets.insertOne({
    address,
    appData,
    blockTimestamp,
    configuration,
    indexData: {
      indexedAt: new Date(),
      serviceRequestCount: 0,
      serviceRequestRewardPools: [],
    },
  });
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

export async function findLaborMarkets({ addresses }: { addresses?: EvmAddress[] }) {
  return mongo.laborMarkets
    .find({
      ...(addresses ? { address: { $in: addresses } } : {}),
    })
    .toArray();
}
