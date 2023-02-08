import type { User } from "@prisma/client";
import { ethers } from "ethers";
import type { TracerEvent } from "pinekit/types";
import { LaborMarket__factory } from "~/contracts";
import type { LaborMarketForm, LaborMarketContract, LaborMarketSearch, LaborMarketDoc } from "~/domain";
import { LaborMarketMetaSchema } from "~/domain";
import { fetchIpfsJson, uploadJsonToIpfs } from "./ipfs.server";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";

/**
 * Returns an array of LaborMarketDoc for a given LaborMarketSearch.
 */
export const searchLaborMarkets = async (params: LaborMarketSearch) => {
  return mongo.laborMarkets
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of LaborMarkets that match a given LaborMarketSearch.
 * @param {LaborMarketSearch} params - The search parameters.
 * @returns {number} - The number of LaborMarkets that match the search.
 */
export const countLaborMarkets = async (params: LaborMarketSearch) => {
  return mongo.laborMarkets.countDocuments(searchParams(params));
};

/**
 * Convenience function to share the search parameters between search and count.
 * @param {LaborMarketSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: LaborMarketSearch): Parameters<typeof mongo.laborMarkets.find>[0] => {
  return {
    valid: true,
    "appData.type": params.type,
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
    ...(params.project ? { "appData.projectSlugs": { $in: params.project } } : {}),
  };
};
/**
 * Prepares a LaborMarket for writing to contract by uploading LaborMarkteMetadata to IPFS and returning a LaborMarketPrepared.
 * @param {LaborMarketForm} form - The labor market form data to prepare.
 * @param {User} user - The user that is creating the LaborMarket.
 * @returns {LaborMarketContract} - The prepared LaborMarket.
 */
export const prepareLaborMarket = async (form: LaborMarketForm, user: User) => {
  const metadata = LaborMarketMetaSchema.parse(form); // Prune extra fields from form
  const cid = await uploadJsonToIpfs(user, metadata, metadata.title);
  const result: LaborMarketContract = { ...form, ipfsHash: cid, userAddress: user.address };
  return result;
};

/**
 * Upserts a LaborMarketDoc in the index database from a Pine TracerEvent.
 */
export async function indexLaborMarket(event: TracerEvent) {
  const contract = LaborMarket__factory.connect(event.contract.address, nodeProvider);
  const config = await contract.configuration({ blockTag: event.block.number });
  const appData = await fetchIpfsJson(config.marketUri)
    .then(LaborMarketMetaSchema.parse)
    .catch(() => null);

  const blockTimestamp = (await nodeProvider.getBlock(event.block.number)).timestamp;

  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<LaborMarketDoc, "serviceRequestCount" | "serviceRequestRewardPools"> = {
    address: event.contract.address,
    valid: appData !== null,
    createdAtBlockTimestamp: new Date(blockTimestamp * 1000),
    indexedAt: new Date(),
    appData,
    configuration: {
      owner: config.owner,
      marketUri: config.marketUri,
      delegateBadge: {
        token: config.delegateBadge.token,
        tokenId: config.delegateBadge.tokenId.toString(),
      },
      maintainerBadge: {
        token: config.maintainerBadge.token,
        tokenId: config.maintainerBadge.tokenId.toString(),
      },
      reputationBadge: {
        token: config.reputationBadge.token,
        tokenId: config.reputationBadge.tokenId.toString(),
      },
      reputationParams: {
        rewardPool: config.reputationParams.rewardPool.toNumber(),
        signalStake: config.reputationParams.signalStake.toNumber(),
        submitMax: config.reputationParams.submitMax.toNumber(),
        submitMin: config.reputationParams.submitMin.toNumber(),
      },
      modules: config.modules,
    },
  };

  return mongo.laborMarkets.updateOne(
    { address: doc.address },
    {
      $set: doc,
      $setOnInsert: {
        serviceRequestCount: 0,
        serviceRequestRewardPools: [],
        createdAtBlockTimestamp: doc.createdAtBlockTimestamp,
      },
    },
    { upsert: true }
  );
}

/**
 * Find a LaborMarket by address. Only returns LaborMarkets that have valid IPFS appData..
 * @param address - The address to search for.
 * @returns LaborMarket - The Labor Market document that matches the address.
 */
export const findLaborMarket = (address: string) => {
  return mongo.laborMarkets.findOne({ address, valid: true });
};
