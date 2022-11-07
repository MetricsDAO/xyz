import type { LaborMarket, LaborMarketSearch } from "~/mdao";
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
  const { address, projectIds, tokenIds, ...data } = laborMarket;
  const newLaborMarket = await prisma.laborMarket.upsert({
    where: { address },
    update: data,
    create: { address, ...data },
  });
  return newLaborMarket;
};
