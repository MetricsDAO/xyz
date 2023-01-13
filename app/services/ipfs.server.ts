import env from "~/env";
import Pinata from "@pinata/sdk";

const pinata = new Pinata({ pinataJWTKey: env.PINATA_JWT });

/**
 * Uploads a JSON object to IPFS and returns the CID.
 * @param data - The JSON object to upload.
 * @param metadata - The metadata to attach to the uploaded object.
 * @returns {Promise<string>} - The CID of the uploaded JSON object.
 */
export async function uploadJsonToIpfs(data: any, metadata: Record<string, string | number | null> = {}) {
  const res = await pinata.pinJSONToIPFS(data, { pinataMetadata: metadata });
  return res.IpfsHash;
}

/**
 * Fetches a JSON object from IPFS.
 * @param cid - The CID of the JSON object to fetch.
 * @returns {Promise<any>} - The JSON object.
 * @throws {Error} - If the response is not JSON.
 */
export async function fetchIpfsJson(cid: string): Promise<any> {
  const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
  if (!res.ok) throw new Error(`Failed to fetch IPFS JSON: ${res.statusText}`);
  return await res.json();
}
