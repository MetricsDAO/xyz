import type { TracerEvent } from "pinekit/types";
import type { z } from "zod";
import { fetchIpfsJson } from "~/services/ipfs.server";

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
 * Validates a response from a url using a given zod schema.
 *
 * @example
 * ```ts
 * const ipfsData = await parseFromIpfs(LaborMarketMetaSchema, someCid);
 */
export async function parseFromIpfs<T extends z.ZodSchema>(schema: T, cid: string): Promise<z.infer<T>> {
  const data = await fetchIpfsJson(cid);
  return schema.parse(data);
}
