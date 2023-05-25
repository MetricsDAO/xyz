import type { User } from "@prisma/client";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import { EvmAddressSchema } from "../address";
import type {
  LaborMarket,
  LaborMarketAppData,
  LaborMarketConfig,
  LaborMarketFilter,
  LaborMarketSearch,
  LaborMarketWithIndexData,
} from "./schemas";
import { LaborMarketConfigSchema } from "./schemas";
import { LaborMarketAppDataSchema } from "./schemas";

/**
 * Returns a LaborMarketWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedLaborMarket(address: EvmAddress): Promise<LaborMarket> {
  const doc = await mongo.laborMarkets.findOne({ address });
  if (!doc) {
    const newDoc = await getLaborMarketFromEventLogs(address);
    invariant(newDoc, "Labor market should have been indexed");
    return newDoc;
  }
  return doc;
}

export async function handleLaborMarketConfiguredEvent(event: TracerEvent) {
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  // Check to see if client has already eagerly indexed this labor market
  let lm = await mongo.laborMarkets.findOne({ address: laborMarketAddress });
  if (!lm) {
    const config = LaborMarketConfigSchema.parse(event.decoded.inputs);
    lm = await createLaborMarket(laborMarketAddress, new Date(event.block.timestamp), config);
    if (!lm) {
      logger.warn("Labor market was not indexed", { laborMarketAddress });
      return;
    }
  }

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "LaborMarket",
    eventType: {
      eventType: "LaborMarketConfigured",
      config: { laborMarketAddress: lm.address, title: lm.appData.title },
    },
    iconType: "labor-market",
    actionName: "Create Marketplace",
    userAddress: event.decoded.inputs.deployer as EvmAddress,
    blockTimestamp: lm.blockTimestamp,
    indexedAt: lm.indexData.indexedAt,
  });
}

/**
 * Creates a LaborMarketWithIndexData in mongodb from chain and ipfs data.
 */
export async function createLaborMarket(address: EvmAddress, blockTimestamp: Date, configuration: LaborMarketConfig) {
  let appData;
  try {
    appData = await getLaborMarketAppData(configuration.uri);
  } catch (e) {
    logger.warn(`Failed to fetch and parse labor market app data for ${address}. Skipping indexing.`, e);
    return null;
  }

  try {
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
  } catch (e) {
    // Probably a race condition between indexer and eager indexing mechanism
    logger.warn(
      `Failed to insert labor market into mongodb for ${address}. Probably a race condition and a violation of unique constraint.`,
      e
    );
  }
  return await mongo.laborMarkets.findOne({ address });
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

async function getLaborMarketFromEventLogs(address: EvmAddress): Promise<LaborMarketWithIndexData | null> {
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.LaborMarketConfigured();
  const data = await contract.queryFilter(eventFilter, -150); // Look back 150 blocks (~5 minutes on Polygon)
  const event = data[0]; // There should only be 1 "LaborMarketConfigured" event
  if (event) {
    const blockTimestamp = (await event.getBlock()).timestamp;
    const config = LaborMarketConfigSchema.parse(event.args);
    return await createLaborMarket(address, new Date(blockTimestamp), config);
  }
  return null;
}

async function getLaborMarketAppData(marketUri: string): Promise<LaborMarketAppData> {
  const data = await fetchIpfsJson(marketUri);
  console.log("IPFS DATA", data);
  return LaborMarketAppDataSchema.parse(data);
}

export async function findLaborMarkets({ addresses }: { addresses?: EvmAddress[] }) {
  return mongo.laborMarkets
    .find({
      ...(addresses ? { address: { $in: addresses } } : {}),
    })
    .toArray();
}
