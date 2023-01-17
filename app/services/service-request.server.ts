import type {
  ServiceRequestForm,
  ServiceRequestContract,
  ServiceRequestSearch,
  ServiceRequestIndexer,
} from "~/domain/service-request";
import { ServiceRequestContractSchema } from "~/domain/service-request";
import { parseDatetime } from "~/utils/date";
import { prisma } from "./prisma.server";

/**
 * Returns an array of Service Requests for a given ServiceRequestSearch.
 * @param {ServiceRequestSearch} params - The search parameters.
 */
export const searchServiceRequests = async (params: ServiceRequestSearch) => {
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
 * Counts the number of Service Requests that match a given ServiceRequestSearch.
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns {number} - The number of Service Requests that match the search.
 */
export const countServiceRequests = async (params: ServiceRequestSearch) => {
  return prisma.serviceRequest.count({
    where: {
      title: { search: params.q },
      laborMarketAddress: params.laborMarket,
    },
  });
};

/**
 * Finds a ServiceRequest by its ID.
 * @param {String} id - The ID of the Challenge.
 * @returns - The ServiceRequest or null if not found.
 */
export const findServiceRequest = async (id: string, laborMarketAddress: string) => {
  return prisma.serviceRequest.findUnique({
    where: { contractId_laborMarketAddress: { contractId: id, laborMarketAddress } },
    include: {
      submissions: true,
      laborMarket: { include: { projects: true } },
      _count: { select: { submissions: true } },
    },
  });
};

/**
 * Creates a new ServiceRequest. This is only really used by the indexer.
 * @param {ServiceRequestIndexer} data - The service request data
 */
export const upsertServiceRequest = async (data: ServiceRequestIndexer) => {
  const newChallenge = await prisma.serviceRequest.create({
    data: {
      contractId: data.contractId,
      title: data.title,
      laborMarketAddress: data.laborMarketAddress,
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
    uri: "ipfs-uri",
    enforcementExpiration: parseDatetime(form.reviewEndDate, form.reviewEndTime),
    submissionExpiration: parseDatetime(form.endDate, form.endTime),
    signalExpiration: parseDatetime(form.startDate, form.startTime),
  });
  return contractData;
};
