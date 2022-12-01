import { generateNonce } from "siwe";

export async function loader() {
  const nonce = generateNonce();
  return nonce;
}
