import type { LaborMarket as PrismaLaborMarket } from "@prisma/client";
import type { LaborMarketMetaCreator, LaborMarketSearch, LaborMarketUpserter } from "~/mdao";
import env from "~/env";
import { LaborMarketSchema } from "~/mdao";
import { prisma } from "./prisma.server";
import { Blob, NFTStorage } from "nft.storage";

const PER_PAGE = 10;

/**
 * Returns an array of LaborMarkets for a given LaborMarketSearch.
 * @param {LaborMarketSearch} params - The search parameters.
 * @returns {PrismaLaborMarket[]}
 */
export const searchMarketplaces = async (params: LaborMarketSearch) => {
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
    },
    orderBy: {
      [params.sortBy]: params.order || "desc",
    },
    take: PER_PAGE,
    skip: PER_PAGE * params.page,
  });
};

/**
 * Creates or updates a new LaborMarket. This is only really used by the indexer.
 * @param {LaborMarket} laborMarket - The labor market to create.
 * @returns {PrismaLaborMarket}
 */
export const upsertLaborMarket: LaborMarketUpserter = async (laborMarket) => {
  const { address, ...data } = laborMarket;
  const newLaborMarket = await prisma.laborMarket.upsert({
    where: { address },
    update: data,
    create: { address, ...data },
  });
  return laborMarketFromPrisma(newLaborMarket);
};

/**
 * Creates a new LaborMarket metadata object in IPFS.
 * The CID is returned to the client and then written to the LaborMarket contract.
 * @param {LaborMarketMeta} metadata - The metadata to store.
 * @returns {string} - The IPFS address (CID) of the metadata.
 */
export const createLaborMarketMeta: LaborMarketMetaCreator = async (metadata) => {
  const client = new NFTStorage({ token: env.NFT_STORAGE_KEY });
  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
  const cid = await client.storeBlob(blob);
  return cid;
};

/**
 * Converts a Prisma LaborMarket to a domain LaborMarket.
 * @param {PrismaLaborMarket} laborMarket - The labor market to convert from Prisma.
 * @returns {PrismaLaborMarket} - Domain LaborMarket
 */
const laborMarketFromPrisma = (laborMarket: PrismaLaborMarket) => {
  return LaborMarketSchema.parse(laborMarket);
};
