import type { PrismaClient } from "@prisma/client";
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
    include: { submissions: true, laborMarket: { include: { projects: true } } },
  });
};

export default class ChallengeService {
  constructor(private prisma: PrismaClient) {}

  // challenges({ page, sortBy, q, project, token }: ChallengeSearch) {
  //   const currentPage = page ?? 1;
  //   const pageSize = 10;
  //   const totalPages = 5;
  //   const data = fakeChallenges(pageSize * totalPages);

  //   let filteredAndSortedData = [...data];
  //   if (sortBy) {
  //     if (sortBy === "project") {
  //       filteredAndSortedData = filteredAndSortedData.sort((a, b) => {
  //         if (a.marketplace.project < b.marketplace.project) return -1;
  //         if (a.marketplace.project > b.marketplace.project) return 1;
  //         return 0;
  //       });
  //     }
  //   }
  //   if (q) {
  //     filteredAndSortedData = filteredAndSortedData.filter((m) => m.title.includes(q));
  //   }
  //   // if (filters) {
  //   //   //Needs badges
  //   // }
  //   if (token) {
  //     filteredAndSortedData = filteredAndSortedData.filter((m) =>
  //       m.marketplace.rewardTokens.some((t) => token.includes(t))
  //     );
  //   }
  //   if (project) {
  //     filteredAndSortedData = filteredAndSortedData.filter((m) => project.includes(m.marketplace.project));
  //   }
  //   const pageData = filteredAndSortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //   const pagesFloor = Math.floor(filteredAndSortedData.length / pageSize);
  //   return {
  //     pageNumber: currentPage,
  //     totalResults: filteredAndSortedData.length,
  //     totalPages: pagesFloor > 0 ? pagesFloor : 1,
  //     data: pageData,
  //   };
  // }
}
