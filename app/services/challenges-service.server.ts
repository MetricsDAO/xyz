import type { ServiceRequest } from "@prisma/client";
import type { ChallengeSearch } from "~/domain/challenge";
import { prisma } from "./prisma.server";

/**
 * Returns an array of Challenges for a given ChallengeSearch.
 * @param {ChallengeSearch} params - The search parameters.
 */
export const searchChallenges = async (params: ChallengeSearch) => {
  return prisma.serviceRequest.findMany({
    include: { submissions: true, laborMarket: { include: { projects: true } } },
    where: {
      laborMarketAddress: params.laborMarket,
    },
    take: params.first,
    skip: params.first * (params.page - 1),
  });
};

/**
 * Counts the number of Challenges that match a given ChallengeSearch.
 * @param {ChallengeSearch} params - The search parameters.
 * @returns {number} - The number of Challenges that match the search.
 */
export const countChallenges = async (params: ChallengeSearch) => {
  return prisma.serviceRequest.count({
    where: {
      laborMarketAddress: params.laborMarket,
    },
  });
};

/**
 * Finds a Challenge by its ID.
 * @param {string} id - The ID of the Challenge.
 * @returns {Promise<Challenge | null>} - The Challenge or null if not found.
 */
export const findChallenge = async (id: string) => {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      submissions: true,
      laborMarket: { include: { projects: true } },
      _count: { select: { submissions: true } },
    },
  });
};

/**
 * Creates a new challenge/serviceRequest. This is only really used by the indexer.
 * @param {Challenge} challenge - The challenge to create.
 */
export const upsertServiceRequest = async (challenge: ServiceRequest) => {
  const { id, title, laborMarketAddress } = challenge;
  const newChallenge = await prisma.serviceRequest.create({
    data: { id, title, laborMarketAddress },
  });
  return newChallenge;
};
