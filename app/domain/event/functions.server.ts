import { mongo } from "~/services/mongo.server";
import type { EventDoc, Event } from "./schema";
import { logger } from "~/services/logger.server";

async function findEvent(event: Event) {
  return mongo.events.findOne(event);
}

async function createEvent(eventDoc: EventDoc) {
  return mongo.events.insertOne(eventDoc);
}

/**
 * This function can be called concurrently and will only create the event if it doesn't already exist.
 * In the event of a race condition, the unique constraint on the collection will prevent duplicate events.
 * @param event
 * @returns boolean indicating if a new event was created
 */
export async function safeCreateEvent(eventDoc: EventDoc): Promise<boolean> {
  const existingEvent = await findEvent(eventDoc);
  if (existingEvent) {
    return false;
  }
  try {
    await createEvent(eventDoc);
    return true;
  } catch (e) {
    logger.warn("Failed to create event. Potentially a race condition violating unique key constraint.", e);
    return false;
  }
}
