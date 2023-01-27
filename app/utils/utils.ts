import type { TracerEvent } from "pinekit/types";
import type { ValidationErrorResponseData } from "remix-validated-form";

/**
 * Type guard function that checks if `data` is a ValidationErrorResponseData.
 * Useful for discriminating the return type of a fetcher or action the can either
 * return valid data or a zod validation error.
 */
export function isValidationError(data: any): data is ValidationErrorResponseData {
  return !!data && "fieldErrors" in data;
}

/**
 * Converts an event's inputs array into an object.
 *
 * @example
 * ```ts
 * const inputs = inputsToObject<LaborMarketConfiguredEventObject>(event.decoded.inputs);
 * ```
 */
export function inputsToObject<T = unknown>(inputs: TracerEvent["decoded"]["inputs"]) {
  return Object.fromEntries(inputs.map((input) => [input.name, input.value])) as T;
}
