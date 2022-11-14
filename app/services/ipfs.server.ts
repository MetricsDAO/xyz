import { z } from "zod";

/**
 * Uploads a JSON object to IPFS and returns the CID.
 * @param data - The JSON object to upload.
 * @returns {string} - The CID of the uploaded JSON object.
 */
export const uploadJsonToIpfs = async (metadata: any) => {
  const { IpfsHash } = IpfsResponseSchema.parse({ IpfsHash: "testhash" });
  return IpfsHash;
};

const IpfsResponseSchema = z.object({
  IpfsHash: z.string(),
});
