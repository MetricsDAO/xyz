import { polygon } from "@wagmi/core/dist/declarations/src/constants/chains";
import { ethers } from "ethers";
import { LaborMarket__factory } from "~/contracts";
import { LaborMarketMetaSchema, LaborMarketSchema } from "~/domain";
import { fetchIpfsJson } from "./ipfs.server";
import { upsertLaborMarket } from "./labor-market.server";
import { logger } from "./logger.server";

/**
 * Saves a labor market from the chain to the database.
 */
export async function indexLaborMarket(address: string) {
  const contract = await getLaborMarketContract(address);
  const config = await contract.configuration();
  const ipfsJson = await fetchIpfsJson(config.marketUri);
  const ipfsData = LaborMarketMetaSchema.parse(ipfsJson);
  const laborMarket = LaborMarketSchema.parse({
    address: contract.address,
    submitRepMin: config.reputationConfig.submitMin,
    submitRepMax: config.reputationConfig.submitMax,
    reviewBadgerAddress: config.maintainerBadge,
    reviewBadgerTokenId: config.maintainerTokenId,
    title: ipfsData.title,
    description: ipfsData.description,
    type: ipfsData.type,
    projectIds: ipfsData.projectIds,
    rewardCurveAddress: config.paymentModule,
    launch: {
      access: "delegates",
      badgerAddress: config.delegateBadge,
      badgerTokenId: config.delegateTokenId,
    },
  });
  await upsertLaborMarket(laborMarket);
  logger.info("indexed: LaborMarket", { address: laborMarket.address });
}

export async function getLaborMarketContract(address: string) {
  const provider = new ethers.providers.InfuraProvider("matic", "54fcc811bac44f99b84a04a4a3e2f998");
  const laborMarket = LaborMarket__factory.connect(address, provider);
  return laborMarket;
}
