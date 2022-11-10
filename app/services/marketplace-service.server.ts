import type { LaborMarket, LaborMarketSearch } from "~/domain";
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
      tokens: params.token ? { some: { symbol: params.token } } : undefined,
      projects: params.project ? { some: { id: params.project } } : undefined,
    },
    orderBy: {
      [params.sortBy]: params.order,
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
 * Creates or updates a new LaborMarket. This is only really used by the indexer.
 * @param {LaborMarket} laborMarket - The labor market to create.
 */
export const upsertLaborMarket = async (laborMarket: LaborMarket) => {
  const { address, projectIds, tokenSymbols, ...data } = laborMarket;
  const newLaborMarket = await prisma.laborMarket.upsert({
    where: { address },
    update: data,
    create: {
      address,
      ...data,
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
  });
};
