import type { User } from "@prisma/client";
import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import { ClaimToSubmitEventSchema, ClaimToReviewEventSchema } from "~/domain";
import type { ServiceRequestDoc, ServiceRequestForm, ServiceRequestSearch } from "~/domain/service-request";
import { ServiceRequestContractSchema, ServiceRequestMetaSchema } from "~/domain/service-request";
import { fromUnixTimestamp, parseDatetime } from "~/utils/date";
import { fetchIpfsJson, uploadJsonToIpfs } from "./ipfs.server";
import { mongo } from "./mongo.server";
import { nodeProvider } from "./node.server";

/**
 * Returns an array of ServiceRequestDoc for a given Service Request.
 */
export const searchServiceRequests = async (params: ServiceRequestSearch) => {
  return mongo.serviceRequests
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();
};

/**
 * Counts the number of ServiceRequests that match a given ServiceRequestSearch.
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns {number} - The number of service requests that match the search.
 */
export const countServiceRequests = async (params: ServiceRequestSearch) => {
  return mongo.serviceRequests.countDocuments(searchParams(params));
};

/**
 * Convenience function to share the search parameters between search and count.
 * @param {ServiceRequestSearch} params - The search parameters.
 * @returns criteria to find labor market in MongoDb
 */
const searchParams = (params: ServiceRequestSearch): Parameters<typeof mongo.serviceRequests.find>[0] => {
  return {
    valid: true,
    ...(params.laborMarket ? { address: params.laborMarket } : {}),
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
    ...(params.project ? { "appData.projectSlugs": { $in: params.project } } : {}),
  };
};

/**
 * Finds a ServiceRequest by its ID.
 * @param {String} id - The ID of the Challenge.
 * @returns - The ServiceRequest or null if not found.
 */
export const findServiceRequest = async (id: string, laborMarketAddress: string) => {
  return mongo.serviceRequests.findOne({ id, address: laborMarketAddress, valid: true });
};

/**
 * Prepare a new Challenge for submission to the contract.
 * @param {string} laborMarketAddress - The labor market address the service request belongs to
 * @param {ServiceRequestForm} form - service request form data
 * @returns {ServiceRequestContract} - The prepared service request.
 */
export const prepareServiceRequest = async (user: User, laborMarketAddress: string, form: ServiceRequestForm) => {
  const metadata = ServiceRequestMetaSchema.parse(form); // Prune extra fields from form
  const cid = await uploadJsonToIpfs(user, metadata, metadata.title);

  // parse for type safety
  const contractData = ServiceRequestContractSchema.parse({
    laborMarketAddress: laborMarketAddress,
    title: form.title,
    description: form.description,
    pTokenAddress: form.rewardToken,
    pTokenQuantity: form.rewardPool,
    uri: cid,
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
    .then(ServiceRequestMetaSchema.parse)
    .catch(() => null);

  const isValid = appData !== null;
  // Build the document, omitting the serviceRequestCount field which is set in the upsert below.
  const doc: Omit<ServiceRequestDoc, "submissionCount" | "claimsToSubmit" | "claimsToReview"> = {
    id: requestId,
    address: event.contract.address,
    valid: isValid,
    indexedAt: new Date(),
    configuration: {
      requester: serviceRequest.serviceRequester,
      uri: serviceRequest.uri,
      pToken: serviceRequest.pToken,
      pTokenQuantity: serviceRequest.pTokenQ.toString(),
      signalExpiration: fromUnixTimestamp(serviceRequest.signalExp.toNumber()),
      submissionExpiration: fromUnixTimestamp(serviceRequest.submissionExp.toNumber()),
      enforcementExpiration: fromUnixTimestamp(serviceRequest.enforcementExp.toNumber()),
    },
    appData,
  };

  if (isValid) {
    await mongo.laborMarkets.updateOne(
      { address: doc.address },
      {
        $inc: {
          serviceRequestCount: 1,
        },
      }
    );
  }

  return mongo.serviceRequests.updateOne(
    { address: doc.address, id: doc.id },
    { $set: doc, $setOnInsert: { submissionCount: 0, claimsToReview: [] } },
    { $set: doc, $setOnInsert: { submissionCount: 0, claimsToSubmit: [], claimsToReview: [] } },
    { upsert: true }
  );
};

export const indexClaimToReview = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { address: event.contract.address, id: inputs.requestId },
    { $push: { claimsToReview: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }
      );
};

export const indexClaimToSubmit = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { address: event.contract.address, id: inputs.requestId },
    { $push: { claimsToSubmit: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }

  );
};
