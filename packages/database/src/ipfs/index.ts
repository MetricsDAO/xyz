import PinataSDK from "@pinata/sdk";
import type { User } from "@prisma/client";
import env from "../env";
import { prisma } from "../prisma";

const pinata = new PinataSDK({
  pinataApiKey: env.PINATA_API_KEY,
  pinataSecretApiKey: env.PINATA_SECRET_API_KEY,
});

const GATEWAY = `https://blue-tough-bird-536.mypinata.cloud`;

/**
 * Uploads a JSON object to IPFS and returns the CID.
 * @param user - The User that wants to perform the upload
 * @param data - The JSON object to upload.
 * @param name - The name which can be used by Pinata for convenience
 * @returns {string} - The CID of the uploaded JSON object.
 */
export const uploadJsonToIpfs = async (user: User, data: any, name?: string) => {
  const res = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      name: name ?? null,
      // @ts-ignore Pinata SDK has the type wrong
      keyvalues: {
        env: env.ENVIRONMENT,
      },
    },
  });

  await prisma.ipfsMetadata.create({
    data: {
      hash: res.IpfsHash,
      sizeBytes: res.PinSize,
      url: `${GATEWAY}/ipfs/${res.IpfsHash}`,
      timestamp: new Date(res.Timestamp), // Timestamp is in ISO 8601 format
      createdById: user.id,
    },
  });
  return res.IpfsHash;
};

/**
 * Fetches a JSON object from IPFS.
 * @param cid - The CID of the JSON object to fetch.
 * @throws {Error} - If the request fails or JSON isn't valid.
 */
export async function fetchIpfsJson(cid: string) {
  return fetch(`${GATEWAY}/ipfs/${cid}`).then((res) => res.json());
}
