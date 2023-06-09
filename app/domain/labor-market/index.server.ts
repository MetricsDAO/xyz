import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { EvmAddressSchema } from "~/domain/address";
import { createLaborMarket, getLaborMarket } from "~/domain/labor-market/functions.server";
import type { LaborMarketConfig } from "~/domain/labor-market/schemas";
import { LaborMarketConfigSchema } from "~/domain/labor-market/schemas";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { safeCreateEvent } from "../event/functions.server";
import type { Event } from "../event/schema";
import { fromUnixTimestamp } from "~/utils/date";

const BLOCK_LOOK_BACK = -150; // Look back 150 blocks (~5 minutes on Polygon)

export async function appLaborMarketConfiguredEvent(event: Event) {
  const { blockNumber, transactionHash, address } = event;
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.LaborMarketConfigured();
  const events = await contract.queryFilter(eventFilter, BLOCK_LOOK_BACK);
  for (const e of events) {
    if (e.blockNumber === blockNumber && e.transactionHash === transactionHash) {
      const block = await e.getBlock();
      const args = LaborMarketConfigSchema.parse(e.args);
      await indexLaborMarketEvent({
        address,
        blockNumber,
        blockTimestamp: fromUnixTimestamp(block.timestamp),
        transactionHash,
        args,
      });
      return;
    }
  }
}

export async function indexerLaborMarketConfiguredEvent(event: TracerEvent) {
  console.log("event", event);
  const address = EvmAddressSchema.parse(event.contract.address);
  const inputs = LaborMarketConfigSchema.parse(event.decoded.inputs);
  await indexLaborMarketEvent({
    address,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: inputs,
  });
}

/**
 * This where "indexing" the labor market into our DB happens. Different event and input types from different systems should be coalesced into this function.
 * This function guards against duplicate events (race conditions) by utilizing "safeCreateEvent"
 * @param event the standardized event
 * @returns
 */
async function indexLaborMarketEvent(event: {
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: LaborMarketConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    logger.info("Already seen a similar event. Skipping indexing.");
    return;
  }
  await createLaborMarket({
    address: event.address,
    blockTimestamp: event.blockTimestamp,
    configuration: event.args,
  });
  const lm = await getLaborMarket(event.address);
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
