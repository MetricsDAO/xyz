import { mongo } from "~/services/mongo.server";
import type { EventDoc, EventKey } from "./schema";
import { logger } from "~/services/logger.server";

async function createEvent({ address, blockNumber, transactionHash, args }: EventDoc) {
  return mongo.events.insertOne({
    address,
    blockNumber,
    transactionHash,
    args,
  });
}

async function findEvent({ address, blockNumber, transactionHash }: EventKey) {
  return mongo.events.findOne({
    address,
    blockNumber,
    transactionHash,
  });
}

export async function safeCreateEvent(event: EventDoc): Promise<boolean> {
  const existingEvent = await findEvent(event);
  if (existingEvent) {
    return false;
  }
  try {
    await createEvent(event);
    return true;
  } catch (e) {
    logger.warn("Failed to create event. Potentially a race condition violating unique key constraint.", e);
    return false;
  }
}
