import type { TracerEvent } from "pinekit/types";

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
