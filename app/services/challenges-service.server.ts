import type { ServiceRequest } from "@prisma/client";
import type { ChallengeNew, ChallengePrepared, ChallengeSearch } from "~/domain/challenge";
import { customStringToDate } from "~/utils/date";
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
export const upsertServiceRequest = async (challenge: ServiceRequest) => {
  const { id, title, laborMarketAddress } = challenge;
  const newChallenge = await prisma.serviceRequest.create({
    data: { id, title, laborMarketAddress },
  });
  return newChallenge;
};

/**
 * Prepare a new Challenge for submission to the contract.
 * @param {ChallengeNew} newChallenge - The ChallengeNew to prepare.
 * @returns {ChallengePrepared} - The prepared Challenge.
 */
export const prepareChallenge = (newChallenge: ChallengeNew): ChallengePrepared => {
  // TODO: upload data to ipfs
  return {
    laborMarketAddress: "0xf48cdadfa609f0348d9e5c14f2801be0a45e0a33", // recently created labor market on Goerli https://goerli.etherscan.io/address/0xf48cdadfa609f0348d9e5c14f2801be0a45e0a33
    pTokenAddress: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc", // FAU token https://erc20faucet.com/
    pTokenQuantity: 0, //TODO
    pTokenId: 0, // TODO
    uri: "ipfs-uri",
    enforcementExpiration: customStringToDate(newChallenge.reviewEndDate, newChallenge.reviewEndTime),
    submissionExpiration: customStringToDate(newChallenge.endDate, newChallenge.endTime),
    signalExpiration: customStringToDate(newChallenge.startDate, newChallenge.startTime),
  };
};
