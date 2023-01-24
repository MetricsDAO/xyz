import type { TracerEvent } from "pinekit/types";
import type { z } from "zod";
import { fetchIpfsJson } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";

/**
 * Converts an event's inputs array into an object.
 *
 * @example
 * ```ts
 * const inputs = inputsToObject<LaborMarketConfiguredEventObject>(event.decoded.inputs);
 * ```
 */
export function inputsToObject<T>(inputs: TracerEvent["decoded"]["inputs"]) {
  return Object.fromEntries(inputs.map((input) => [input.name, input.value])) as T;
}

/**
 * Validates a response from a url using a given zod schema. Throws if the schema is invalid.
 *
 * @example
 * ```ts
 * const ipfsData = await parseFromIpfs(LaborMarketMetaSchema, someCid);
 */
export async function parseFromIpfs<T extends z.ZodSchema>(schema: T, cid: string): Promise<z.infer<T>> {
  const res = await fetchIpfsJson(cid);
  if (!res.ok) {
    logger.error(`Failed to fetch IPFS data for CID ${cid}, status ${res.status}`);
    throw new Error(`Failed to fetch IPFS data for CID ${cid}`);
  }
  const data = await res.json();
  return schema.parse(data);
}
