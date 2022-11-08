import { NFTStorage } from "nft.storage";
import env from "~/env";
import type { LaborMarketMeta } from "~/domain";

/**
 * Creates a new LaborMarket metadata object in IPFS.
 * The CID is returned to the client and then written to the LaborMarket contract.
 * @param {LaborMarketMeta} metadata - The metadata to store.
 * @returns {string} - The IPFS address (CID) of the metadata.
 */
export const createLaborMarketMeta = async (metadata: LaborMarketMeta) => {
  const client = new NFTStorage({ token: env.NFT_STORAGE_KEY });
  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
  const cid = await client.storeBlob(blob);
  return cid;
};
