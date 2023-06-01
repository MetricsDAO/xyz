import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { EvmAddressSchema } from "~/domain/address";
import { createLaborMarket, getLaborMarket } from "~/domain/labor-market/functions.server";
import { LaborMarketConfigSchema } from "~/domain/labor-market/schemas";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { safeCreateEvent } from "../event/functions.server";
import type { EventKey } from "../event/schema";
import { logger } from "~/services/logger.server";

export async function appIndexLaborMarket(event: EventKey) {
  const { blockNumber, transactionHash, address } = event;
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.LaborMarketConfigured();
  const events = await contract.queryFilter(eventFilter, -6000); // Look back 150 blocks (~5 minutes on Polygon)
  console.log("events", events);
  for (const event of events) {
    if (event.blockNumber === blockNumber && event.transactionHash === transactionHash) {
      console.log("found event", event);
      const blockTimestamp = (await event.getBlock()).timestamp;
      const inputs = LaborMarketConfigSchema.parse(event.args);
      const isNewEvent = await safeCreateEvent({ address, blockNumber, transactionHash, args: inputs });
      if (!isNewEvent) {
        logger.info("appIndexLaborMarket: Already seen event. Skipping.");
        return;
      }
      await createLaborMarket(address, new Date(blockTimestamp), inputs);
    }
  }
}

export async function indexerLaborMarketConfiguredEvent(event: TracerEvent) {
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);
  const inputs = LaborMarketConfigSchema.parse(event.decoded.inputs);
  const isNewEvent = await safeCreateEvent({
    address: laborMarketAddress,
    blockNumber: event.block.number,
    transactionHash: event.txHash,
    args: inputs,
  });
  if (!isNewEvent) {
    logger.info("indexerLaborMarketConfiguredEvent: Already seen event. Skipping.");
    return;
  }
  await createLaborMarket(laborMarketAddress, new Date(event.block.timestamp), inputs);
  const lm = await getLaborMarket(laborMarketAddress);
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
    userAddress: event.decoded.inputs.deployer as EvmAddress,
    blockTimestamp: lm.blockTimestamp,
    indexedAt: lm.indexData.indexedAt,
  });
}
