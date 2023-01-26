import type { User } from "@prisma/client";
import { LaborMarket__factory } from "~/contracts";
import type { LaborMarketForm, LaborMarketContract, LaborMarketSearch } from "~/domain";
import { LaborMarketMetaSchema } from "~/domain";
import { fetchIpfsJson, uploadJsonToIpfs } from "./ipfs.server";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";
import { prisma } from "./prisma.server";

/**
 * Returns an array of LaborMarkets for a given LaborMarketSearch.
 * @param {LaborMarketSearch} params - The search parameters.
 */
export const searchLaborMarkets = async (params: LaborMarketSearch) => {
  return prisma.laborMarket.findMany({
    include: {
      _count: {
        select: { serviceRequests: true },
      },
      projects: true,
    },
    where: {
      type: params.type,
      title: { search: params.q },
      description: { search: params.q },
      tokens: params.token ? { some: { OR: params.token.map((symbol) => ({ symbol })) } } : undefined,
      projects: params.project ? { some: { OR: params.project.map((slug) => ({ slug })) } } : undefined,
    },
    orderBy: {
      [params.sortBy]:
        "serviceRequests" !== params.sortBy
          ? params.order
          : {
              _count: params.order,
            },
    },
    take: params.first,
    skip: params.first * (params.page - 1),
  });
};

/**
 * Returns an array of LaborMarketDoc for a given LaborMarketSearch.
 * TODO: Replace searchLaborMarkets with this.
 * @param params
 * @returns
 */
export const searchLaborMarketsMongo = async (params: LaborMarketSearch) => {
  return mongo.laborMarkets
    .find({
      $text: { $search: params.q ?? "" },
      "appData.projectIds": params.project ? { $in: params.project?.map ?? [] } : undefined,
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
 * @param {LaborMarketForm} newLaborMarket - The LaborMarketNew to prepare.
 * @param {User} user - The user that is creating the LaborMarket.
 * @returns {LaborMarketContract} - The prepared LaborMarket.
 */
export const prepareLaborMarket = async (newLaborMarket: LaborMarketForm, user: User) => {
  const metadata = LaborMarketMetaSchema.parse(newLaborMarket); // Prune extra fields from LaborMarketNew
  const cid = await uploadJsonToIpfs(metadata);
  const result: LaborMarketContract = { ...newLaborMarket, ipfsHash: cid, userAddress: user.address };
  return result;
};

/**
 * Creates or updates a new LaborMarket. This is only really used by the indexer.
 * @param {LaborMarket} laborMarket - The labor market to create.
 */
// export const upsertLaborMarket = async (laborMarket: LaborMarket) => {
//   const { address } = laborMarket;
//   const newLaborMarket = await prisma.laborMarket.upsert({
//     where: { address },
//     update: mapToLaborMarketTableFormat(laborMarket),
//     create: mapToLaborMarketTableFormat(laborMarket),
//   });
//   return newLaborMarket;
// };

/**
 * Creates a new LaborMarketDocument object from on-chain data on the contract at `address` at `block`.
 */
export const documentLaborMarket = async ({ address, block }: { address: string; block?: number }) => {
  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const config = await contract.configuration({ blockTag: block });

  // only save appData if it's valid, otherwise save null
  const appData = await fetchIpfsJson(config.marketUri)
    .then(LaborMarketMetaSchema.parse)
    .catch(() => null);

  return {
    address,
    owner: await contract.owner({ blockTag: block }),
    reputationConfig: {
      submitMin: config.reputationConfig.submitMin.toNumber(),
      submitMax: config.reputationConfig.submitMax.toNumber(),
    },
    maintainerBadge: config.maintainerBadge,
    maintainerTokenId: config.maintainerTokenId.toString(),
    paymentModule: config.paymentModule,
    delegateBadge: config.delegateBadge,
    delegateTokenId: config.delegateTokenId.toString(),
    appData,
  };
};

export type LaborMarketDoc = Awaited<ReturnType<typeof documentLaborMarket>>;

/**
 * Upserts a LaborMarketDocument into the database by address.
 * TODO: Rename to upsertLaborMarket once the old one is removed.
 */
export const indexLaborMarket = async (doc: LaborMarketDoc) => {
  return mongo.laborMarkets.updateOne({ address: doc.address }, { $set: doc }, { upsert: true });
};

// const mapToLaborMarketTableFormat = (laborMarket: LaborMarket) => {
//   const { address, projectIds, ...data } = laborMarket;
//   return {
//     address,
//     title: data.title,
//     description: data.description,
//     type: data.type,
//     submitRepMin: data.submitRepMin,
//     submitRepMax: data.submitRepMax,
//     rewardCurveAddress: data.rewardCurveAddress,
//     reviewBadgerAddress: data.reviewBadgerAddress,
//     reviewBadgerTokenId: data.reviewBadgerTokenId,
//     launchAccess: data.launch.access,
//     launchBadgerAddress: data.launch.access === "delegates" ? data.launch.badgerAddress : undefined,
//     launchBadgerTokenId: data.launch.access === "delegates" ? data.launch.badgerTokenId : undefined,
//     sponsorAddress: data.sponsorAddress,
//     projects: { connect: projectIds.map((id) => ({ id })) },
//   };
// };

/**
 * Counts the number of LaborMarkets that match a given LaborMarketSearch.
 * @param {address} params - The address to search for.
 * @returns {LaborMarket} - The Labor Market that matches the address.
 */
export const findLaborMarket = async (address: string) => {
  return prisma.laborMarket.findFirst({
    where: {
      address: address,
    },
    include: { _count: { select: { serviceRequests: true } } },
  });
};
