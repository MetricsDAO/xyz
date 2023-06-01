import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import { EvmAddressSchema } from "~/domain/address";
import { createLaborMarket, getLaborMarket } from "~/domain/labor-market/functions.server";
import type { LaborMarketBase } from "~/domain/labor-market/schemas";
import { LaborMarketConfigSchema } from "~/domain/labor-market/schemas";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import type { Event, EventDoc } from "../event/schema";
import { safeCreateEvent } from "../event/functions.server";

const BLOCK_LOOK_BACK = -150; // Look back 150 blocks (~5 minutes on Polygon)

export async function appLaborMarketConfiguredEvent(event: Event) {
  const { blockNumber, transactionHash, address } = event;
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.LaborMarketConfigured();
  const events = await contract.queryFilter(eventFilter, BLOCK_LOOK_BACK);
  for (const e of events) {
    if (e.blockNumber === blockNumber && e.transactionHash === transactionHash) {
      const blockTimestamp = (await e.getBlock()).timestamp;
      const args = LaborMarketConfigSchema.parse(e.args);
      await indexLaborMarketEvent(
        { ...event, args },
        { address, blockTimestamp: new Date(blockTimestamp), configuration: args }
      );
      return;
    }
  }
}

export async function indexerLaborMarketConfiguredEvent(event: TracerEvent) {
  const address = EvmAddressSchema.parse(event.contract.address);
  const inputs = LaborMarketConfigSchema.parse(event.decoded.inputs);
  await indexLaborMarketEvent(
    { address, blockNumber: event.block.number, transactionHash: event.txHash, args: inputs },
    { address, blockTimestamp: new Date(event.block.timestamp), configuration: inputs }
  );
}

/**
 * This where indexing the labor market into our DB happens. Different event and inputtypes from different systems should be coalesced into this function.
 * @param event the standardized event
 * @param input the minimum input needed to create a labor market
 * @returns
 */
async function indexLaborMarketEvent(event: EventDoc, input: LaborMarketBase) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    logger.info("Already seen a similar event. Skipping indexing.");
    return;
  }
  await createLaborMarket(input);
  const lm = await getLaborMarket(input.address);
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
