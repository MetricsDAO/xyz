import { useMutation } from "wagmi";
import type { LaborMarketNew, LaborMarketPrepared } from "~/domain";
import { uploadJsonToIpfs } from "~/services/ipfs.server";

/**
 * Creates a react-query mutation that accepts a LaborMarketNew and returns a LaborMarketPrepared on success.
 */
export const usePrepareLaborMarket = () => {
  return useMutation<LaborMarketPrepared, any, LaborMarketNew>(async (metadata) => {
    const cid = await uploadJsonToIpfs(metadata);
    return { ...metadata, ipfsHash: cid };
  });
};
