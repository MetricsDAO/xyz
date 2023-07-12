import invariant from "tiny-invariant";
// import { logger } from "~/services/logger.server";
import {
  EvmAddress,
  LaborMarketAppData,
  LaborMarketAppDataSchema,
  LaborMarketBase,
  LaborMarketConfig,
} from "@mdao/schema";
import { mongo } from "../mongo";
import { safeCreateEvent } from "./event";
import { fetchIpfsJson } from "../../ipfs";

export async function indexLaborMarketEvent(event: {
  name: string;
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: LaborMarketConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    console.info("Already seen a similar event. Skipping indexing.");
    return;
  }

  // Let's not crash the indexer for a bad labor market
  try {
    await createLaborMarket({
      address: event.address,
      blockTimestamp: event.blockTimestamp,
      configuration: event.args,
    });
  } catch (e) {
    console.warn("Failed to index labor market event", e);
    return;
  }

  const lm = await mongo.laborMarkets.findOne({ address: event.address });
  invariant(lm, "Labor market should exist after creation");

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "LaborMarket",
    eventType: {
      eventType: "LaborMarketConfigured",
      config: { laborMarketAddress: lm.address, title: lm.appData.title },
    },
    iconType: "labor-market",
    actionName: "Create Marketplace",
    userAddress: lm.configuration.deployer,
    blockTimestamp: lm.blockTimestamp,
    indexedAt: lm.indexData.indexedAt,
  });
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
async function createLaborMarket(laborMarket: LaborMarketBase) {
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
