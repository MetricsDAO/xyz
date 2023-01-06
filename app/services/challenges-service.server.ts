import type { ChallengeNew, ChallengePrepared, ChallengeSearch } from "~/domain/challenge";
import { ChallengePreparedSchema } from "~/domain/challenge";
import { parseDatetime } from "~/utils/date";
import { prisma } from "./prisma.server";

/**
 * Returns an array of Challenges for a given ChallengeSearch.
 * @param {ChallengeSearch} params - The search parameters.
 */
export const searchChallenges = async (params: ChallengeSearch) => {
  return prisma.serviceRequest.findMany({
    include: { submissions: true, laborMarket: { include: { projects: true } } },
    where: {
      title: { search: params.q },
      laborMarketAddress: params.laborMarket,
    },
    orderBy: {
      [params.sortBy]: params.order,
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
      title: { search: params.q },
      laborMarketAddress: params.laborMarket,
    },
  });
};

/**
 * Finds a Challenge by its ID.
 * @param {string} id - The ID of the Challenge.
 * @returns - The Challenge or null if not found.
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
export const upsertServiceRequest = async (challenge: ChallengePrepared) => {
  const newChallenge = await prisma.serviceRequest.create({
    data: {
      title: challenge.title,
      laborMarketAddress: challenge.laborMarketAddress,
    },
  });
  return newChallenge;
};

/**
 * Prepare a new Challenge for submission to the contract.
 * @param {ChallengeNew} newChallenge - The ChallengeNew to prepare.
 * @returns {ChallengePrepared} - The prepared Challenge.
 */
export const prepareChallenge = (laborMarketAddress: string, newChallenge: ChallengeNew): ChallengePrepared => {
  // TODO: upload data to ipfs

  // parse for type safety
  const preparedChallenge = ChallengePreparedSchema.parse({
    title: newChallenge.title,
    description: newChallenge.description,
    laborMarketAddress: laborMarketAddress,
    pTokenAddress: newChallenge.rewardToken,
    pTokenQuantity: newChallenge.rewardPool,
    pTokenId: 0, // Not used by contract. Left over appendage from when we were using ERC1155. We might switch back at some point.
    uri: "ipfs-uri",
    enforcementExpiration: parseDatetime(newChallenge.reviewEndDate, newChallenge.reviewEndTime),
    submissionExpiration: parseDatetime(newChallenge.endDate, newChallenge.endTime),
    signalExpiration: parseDatetime(newChallenge.startDate, newChallenge.startTime),
  });
  return preparedChallenge;
};
