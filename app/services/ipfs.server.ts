import PinataSDK from "@pinata/sdk";
import env from "~/env";
import { logger } from "./logger.server";
const pinata = new PinataSDK({
  pinataApiKey: env.PINATA_API_KEY,
  pinataSecretApiKey: env.PINATA_SECRET_API_KEY,
});

/**
 * Uploads a JSON object to IPFS and returns the CID.
 * @param data - The JSON object to upload.
 * @param name - The name which can be used by Pinata for convenience
 * @returns {string} - The CID of the uploaded JSON object.
 */
export const uploadJsonToIpfs = async (data: any, name: string) => {
  if (env.DEV_SKIP_IPFS_UPLOAD) return "ipfs-upload-disabled";
  const res = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      name,
    },
  });
  logger.info("Uploaded JSON to IPFS", res);
  return res.IpfsHash;
};
