import type { User } from "@prisma/client";
import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongoPromise } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { EvmAddress } from "../address";
import { EvmAddressSchema } from "../address";
import type {
  LaborMarketAppData,
  LaborMarketFilter,
  LaborMarketIndexData,
  LaborMarketSearch,
  LaborMarketWithIndexData,
} from "./schemas";
import { LaborMarketAppDataSchema, LaborMarketConfigSchema, LaborMarketWithIndexDataSchema } from "./schemas";

/**
 * Returns a LaborMarketWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedLaborMarket(address: EvmAddress): Promise<LaborMarketWithIndexData> {
  const mongo = await mongoPromise;
  const doc = await mongo.laborMarkets.findOne({ address });
  if (!doc) {
    const newDoc = await upsertIndexedLaborMarket(address);
    invariant(newDoc, "Labor market should have been indexed");
    return newDoc;
  }
  return LaborMarketWithIndexDataSchema.parse(doc);
}

export async function handleLaborMarketConfiguredEvent(event: TracerEvent) {
  const mongo = await mongoPromise;
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const lm = await upsertIndexedLaborMarket(laborMarketAddress, event);
  if (!lm) {
    logger.warn("Labor market was not indexed", { laborMarketAddress });
    return;
  }

  //log this event in user activity collection
  mongo.userActivity.insertOne({
    groupType: "LaborMarket",
    eventType: {
      eventType: "LaborMarketConfigured",
      config: { laborMarketAddress: lm.address, title: lm.appData.title },
    },
    iconType: "labor-market",
    actionName: "Create Marketplace",
    userAddress: lm.configuration.owner,
    createdAtBlockTimestamp: lm.indexData.createdAtBlockTimestamp,
    indexedAt: lm.indexData.indexedAt,
  });
}

/**
 * Creates a LaborMarketWithIndexData in mongodb from chain and ipfs data.
 */
export async function upsertIndexedLaborMarket(address: EvmAddress, event?: TracerEvent) {
  const mongo = await mongoPromise;
  const checksumAddress = getAddress(address);
  const configuration = await getLaborMarketConfig(checksumAddress, event?.block.number);
  let appData;
  try {
    appData = await getLaborMarketAppData(configuration.marketUri);
  } catch (e) {
    logger.warn(`Failed to fetch and parse labor market app data for ${checksumAddress}. Skipping indexing.`, e);
    return;
  }
  const laborMarket = { checksumAddress, configuration, appData };
  const indexData: LaborMarketIndexData = {
    indexedAt: new Date(),
    serviceRequestCount: 0,
    serviceRequestRewardPools: [],
    createdAtBlockTimestamp: event?.block.timestamp ? new Date(event.block.timestamp) : new Date(),
  };

  const res = await mongo.laborMarkets.findOneAndUpdate(
    { address },
    { $set: laborMarket, $setOnInsert: { indexData } },
    { upsert: true, returnDocument: "after" }
  );

  return res.value;
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
export async function countLaborMarkets(filter: LaborMarketFilter) {
  const mongo = await mongoPromise;
  return mongo.laborMarkets.countDocuments(filterToMongo(filter));
}

/**
 * Returns an array of LaborMarketsWithIndexData for a given LaborMarketSearch.
 */
export async function searchLaborMarkets(search: LaborMarketSearch) {
  const mongo = await mongoPromise;
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
function filterToMongo(filter: LaborMarketFilter): Parameters<Awaited<typeof mongoPromise>["laborMarkets"]["find"]>[0] {
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

export async function findLaborMarkets() {
  const mongo = await mongoPromise;
  return mongo.laborMarkets.find().toArray();
}
