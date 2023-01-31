import type { ValidationErrorResponseData } from "remix-validated-form";

/**
 * Type guard function that checks if `data` is a ValidationErrorResponseData.
 * Useful for discriminating the return type of a fetcher or action the can either
 * return valid data or a zod validation error.
 */
export function isValidationError(data: any): data is ValidationErrorResponseData {
  return !!data && "fieldErrors" in data;
}
