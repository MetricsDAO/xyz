import type { User } from "@prisma/client";
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
    .find({
      valid: true,
      ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
      ...(params.project ? { "appData.projectIds": { $in: params.project } } : {}),
    })
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
  // TODO: Filter on "type" once we start saving that in the appData
  return mongo.laborMarkets.countDocuments({ $text: { $search: params.q ?? "" } });
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

  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<LaborMarketDoc, "serviceRequestCount"> = {
    address: event.contract.address,
    valid: appData !== null,
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
    { $set: doc, $setOnInsert: { serviceRequestCount: 0 } },
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
