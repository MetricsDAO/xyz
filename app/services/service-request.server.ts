import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type {
  ServiceRequestContract,
  ServiceRequestDoc,
  ServiceRequestForm,
  ServiceRequestSearch,
} from "~/domain/service-request";
import { ServiceRequestContractSchema, ServiceRequestIpfsSchema } from "~/domain/service-request";
import { fromUnixTimestamp, parseDatetime } from "~/utils/date";
import { fetchIpfsJson } from "./ipfs.server";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";
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

// /**
//  * Creates or replaces a new ServiceRequest. This is only really used by the indexer.
//  * @param doc - The service request document.
//  */
// export const upsertServiceRequest = async (doc: ServiceRequestDoc) => {
//   return mongo.serviceRequests.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
// };

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

/**
 * Create a new ServiceRequestDoc from a TracerEvent.
 */
export const indexServiceRequest = async (event: TracerEvent) => {
  const contract = LaborMarket__factory.connect(event.contract.address, nodeProvider);
  const requestId = z.string().parse(event.decoded.inputs.requestId);
  const serviceRequest = await contract.serviceRequests(requestId, { blockTag: event.block.number });
  const appData = await fetchIpfsJson(serviceRequest.uri)
    .then(ServiceRequestIpfsSchema.parse)
    .catch(() => null);

  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<ServiceRequestDoc, "submissionCount"> = {
    address: event.contract.address,
    valid: appData !== null,
    indexedAt: new Date(),
    configuration: {
      requester: serviceRequest.serviceRequester,
      uri: serviceRequest.uri,
      pToken: serviceRequest.pToken,
      pTokenQuantity: serviceRequest.pTokenQ.toString(),
      signalExpiration: fromUnixTimestamp(serviceRequest.signalExp.toString()),
      submissionExpiration: fromUnixTimestamp(serviceRequest.submissionExp.toString()),
      enforcementExpiration: fromUnixTimestamp(serviceRequest.enforcementExp.toString()),
    },
    appData,
  };

  return mongo.serviceRequests.updateOne(
    { address: doc.address },
    { $set: doc, $setOnInsert: { submissionCount: 0 } },
    { upsert: true }
  );
};
