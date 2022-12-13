import type { LaborMarket, LaborMarketNew, LaborMarketPrepared, LaborMarketSearch } from "~/domain";
import { LaborMarketMetaSchema } from "~/domain";
import { uploadJsonToIpfs } from "./ipfs.server";
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
 * Counts the number of LaborMarkets that match a given LaborMarketSearch.
 * @param {LaborMarketSearch} params - The search parameters.
 * @returns {number} - The number of LaborMarkets that match the search.
 */
export const countLaborMarkets = async (params: LaborMarketSearch) => {
  return prisma.laborMarket.count({
    where: {
      type: params.type,
      title: { search: params.q },
      description: { search: params.q },
    },
  });
};

/**
 * Prepares a LaborMarket for writing to contract by uploading LaborMarkteMetadata to IPFS and returning a LaborMarketPrepared.
 * @param {LaborMarketNew} newLaborMarket - The LaborMarketNew to prepare.
 * @returns {LaborMarketPrepared} - The prepared LaborMarket.
 */
export const prepareLaborMarket = async (newLaborMarket: LaborMarketNew) => {
  const metadata = LaborMarketMetaSchema.parse(newLaborMarket); // Prune extra fields from LaborMarketNew
  const cid = await uploadJsonToIpfs(metadata);
  const result: LaborMarketPrepared = { ...newLaborMarket, ipfsHash: cid };
  return result;
};

/**
 * Creates or updates a new LaborMarket. This is only really used by the indexer.
 * @param {LaborMarket} laborMarket - The labor market to create.
 */
export const upsertLaborMarket = async (laborMarket: LaborMarket) => {
  const { address, projectIds, tokenSymbols, ...data } = laborMarket;
  const newLaborMarket = await prisma.laborMarket.upsert({
    where: { address },
    update: {
      address,
      title: data.title,
      description: data.description,
      type: data.type,
      submitRepMin: data.submitRepMin,
      submitRepMax: data.submitRepMax,
      rewardCurveAddress: data.rewardCurveAddress,
      reviewBadgerAddress: data.reviewBadgerAddress,
      reviewBadgerTokenId: data.reviewBadgerTokenId,
      launchAccess: data.launch.access,
      launchBadgerAddress: data.launch.access === "delegates" ? data.launch.badgerAddress : undefined,
      launchBadgerTokenId: data.launch.access === "delegates" ? data.launch.badgerTokenId : undefined,
      sponsorAddress: data.sponsorAddress,
      projects: { connect: projectIds.map((id) => ({ id })) },
      tokens: { connect: tokenSymbols.map((symbol) => ({ symbol })) },
    },
    create: {
      address,
      title: data.title,
      description: data.description,
      type: data.type,
      submitRepMin: data.submitRepMin,
      submitRepMax: data.submitRepMax,
      rewardCurveAddress: data.rewardCurveAddress,
      reviewBadgerAddress: data.reviewBadgerAddress,
      reviewBadgerTokenId: data.reviewBadgerTokenId,
      launchAccess: data.launch.access,
      launchBadgerAddress: data.launch.access === "delegates" ? data.launch.badgerAddress : undefined,
      launchBadgerTokenId: data.launch.access === "delegates" ? data.launch.badgerTokenId : undefined,
      sponsorAddress: data.sponsorAddress,
      projects: { connect: projectIds.map((id) => ({ id })) },
      tokens: { connect: tokenSymbols.map((symbol) => ({ symbol })) },
    },
  });
  return newLaborMarket;
};

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
