import type { User } from "@prisma/client";
import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { fetchIpfsJson, uploadJsonToIpfs } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import type { EvmAddress } from "../address";
import { EvmAddressSchema } from "../address";
import type {
  LaborMarketAppData,
  LaborMarketFilter,
  LaborMarketIndexData,
  LaborMarketSearch,
  LaborMarketWithIndexData,
} from "./schemas";
import { LaborMarketWithIndexDataSchema } from "./schemas";
import { LaborMarketAppDataSchema } from "./schemas";

/**
 * Returns a LaborMarketWithIndexData from mongodb, if it exists.
 * If it doesn't exist, it probably means that it hasn't been indexed yet so we
 * index it eagerly and return the result.
 */
export async function getIndexedLaborMarket(address: EvmAddress): Promise<LaborMarketWithIndexData> {
  const doc = await mongo.laborMarkets.findOne({ address });
  if (!doc) {
    const newDoc = await upsertIndexedLaborMarket(address);
    invariant(newDoc, "Labor market should have been indexed");
    return newDoc;
  }
  return LaborMarketWithIndexDataSchema.parse(doc);
}

export async function handleLaborMarketConfiguredEvent(event: TracerEvent) {
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const lm = await upsertIndexedLaborMarket(laborMarketAddress, event);
  if (!lm) {
    logger.warn("Labor market was not indexed", { laborMarketAddress });
    return;
  }
  invariant(lm.blockTimestamp, "Labor market should have a block timestamp");
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
export async function upsertIndexedLaborMarket(address: EvmAddress, event: TracerEvent) {
  const checksumAddress = getAddress(address);
  let appData;
  const eventData = event.decoded.inputs;
  console.log("eventData", eventData);
  const cid = eventData.uri as string;
  console.log("cid", cid);
  try {
    appData = await getLaborMarketAppData(cid);
    console.log("appData", appData);
  } catch (e) {
    logger.warn(`Failed to fetch and parse labor market app data for ${checksumAddress}. Skipping indexing.`, e);
    return;
  }
  const laborMarket = {
    checksumAddress,
    eventData,
    appData,
    blockTimestamp: event?.block.timestamp ? new Date(event.block.timestamp) : undefined,
  };
  const indexData: LaborMarketIndexData = {
    indexedAt: new Date(),
    serviceRequestCount: 0,
    serviceRequestRewardPools: [],
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

// async function getLaborMarketConfig(address: string, block?: number) {
//   const contract = LaborMarket__factory.connect(address, nodeProvider);
//   const data = await contract.configuration();
//   return LaborMarketConfigSchema.parse(data);
// }

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
