/**
 * Transform to be used in zod schemas to convert ether's array results to objects.
 * @param array
 * @returns
 */
export function arrayToObject(array: unknown) {
  if (Array.isArray(array)) {
    return Object.assign({}, array);
  }
  return array;
}
