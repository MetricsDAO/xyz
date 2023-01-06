import type { ServiceRequestForm, ServiceRequestContract, ServiceRequestSearch } from "~/domain/service-request";
import { ServiceRequestContractSchema } from "~/domain/service-request";
import { parseDatetime } from "~/utils/date";
import { prisma } from "./prisma.server";

/**
 * Returns an array of Challenges for a given ChallengeSearch.
 * @param {ServiceRequestSearch} params - The search parameters.
 */
export const searchChallenges = async (params: ServiceRequestSearch) => {
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
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns {number} - The number of Challenges that match the search.
 */
export const countChallenges = async (params: ServiceRequestSearch) => {
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
export const upsertServiceRequest = async (challenge: ServiceRequestContract) => {
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
 * @param {string} laborMarketAddress - The labor market address the service request belongs to
 * @param {ServiceRequestForm} form - service request form data
 * @returns {ServiceRequestContract} - The prepared service request.
 */
export const prepareServiceRequest = (laborMarketAddress: string, form: ServiceRequestForm): ServiceRequestContract => {
  // TODO: upload data to ipfs

  // parse for type safety
  const contractData = ServiceRequestContractSchema.parse({
    laborMarketAddress: laborMarketAddress,
    title: form.title,
    description: form.description,
    pTokenAddress: form.rewardToken,
    pTokenQuantity: form.rewardPool,
    pTokenId: 0, // Not used by contract. Left over appendage from when we were using ERC1155. We might switch back at some point.
    uri: "ipfs-uri",
    enforcementExpiration: parseDatetime(form.reviewEndDate, form.reviewEndTime),
    submissionExpiration: parseDatetime(form.endDate, form.endTime),
    signalExpiration: parseDatetime(form.startDate, form.startTime),
  });
  return contractData;
};
