import { BigNumber } from "ethers";
import type { TracerEvent } from "pinekit/types";
import { z } from "zod";
import { LaborMarket__factory } from "~/contracts";
import type { LaborMarketDoc } from "~/domain";
import { ClaimToReviewEventSchema, ClaimToSubmitEventSchema } from "~/domain";
import type { ServiceRequestDoc, ServiceRequestSearch } from "~/domain/service-request/schemas";
import { ServiceRequestMetaSchema } from "~/domain/service-request/schemas";
import { fetchIpfsJson } from "~/services/ipfs.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { fromUnixTimestamp } from "~/utils/date";

/**
 * Returns an array of ServiceRequestDoc for a given Service Request.
 */
export const searchServiceRequests = async (params: ServiceRequestSearch) => {
  return mongo.serviceRequests
    .find(searchParams(params))
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
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
    ...(params.laborMarket ? { laborMarketAddress: params.laborMarket as `0x${string}` } : {}),
    ...(params.q ? { $text: { $search: params.q, $language: "english" } } : {}),
    ...(params.language ? { "appData.language": { $in: params.language } } : {}),
    ...(params.project ? { "appData.projectSlugs": { $in: params.project } } : {}),
  };
};

/**
 * Finds a ServiceRequest by its ID.
 * @param {String} id - The ID of the Challenge.
 * @returns - The ServiceRequest or null if not found.
 */
export const findServiceRequest = async (id: string, laborMarketAddress: string) => {
  return mongo.serviceRequests.findOne({ id, laborMarketAddress: laborMarketAddress as `0x${string}`, valid: true });
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
  const doc: Omit<
    ServiceRequestDoc,
    "submissionCount" | "claimsToSubmit" | "claimsToReview" | "createdAtBlockTimestamp"
  > = {
    id: requestId,
    laborMarketAddress: event.contract.address as `0x${string}`,
    valid: isValid,
    indexedAt: new Date(),
    configuration: {
      requester: serviceRequest.serviceRequester as `0x${string}`,
      uri: serviceRequest.uri,
      pToken: serviceRequest.pToken as `0x${string}`,
      pTokenQuantity: serviceRequest.pTokenQ.toString(),
      signalExpiration: fromUnixTimestamp(serviceRequest.signalExp.toNumber()),
      submissionExpiration: fromUnixTimestamp(serviceRequest.submissionExp.toNumber()),
      enforcementExpiration: fromUnixTimestamp(serviceRequest.enforcementExp.toNumber()),
    },
    appData,
  };

  if (isValid) {
    const lm = await mongo.laborMarkets.findOne({ address: doc.laborMarketAddress });
    await mongo.laborMarkets.updateOne(
      { address: doc.laborMarketAddress },
      {
        $inc: {
          "indexData.serviceRequestCount": 1,
        },
        $set: {
          "indexData.serviceRequestRewardPools": calculateRewardPools(
            lm?.indexData.serviceRequestRewardPools ?? [],
            doc.configuration.pToken,
            doc.configuration.pTokenQuantity
          ),
        },
      }
    );
  }

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: doc.laborMarketAddress, id: doc.id },
    {
      $set: doc,
      $setOnInsert: {
        submissionCount: 0,
        claimsToSubmit: [],
        claimsToReview: [],
        createdAtBlockTimestamp: new Date(event.block.timestamp),
      },
    },
    { upsert: true }
  );
};

export const indexClaimToReview = async (event: TracerEvent) => {
  const inputs = ClaimToReviewEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: event.contract.address as `0x${string}`, id: inputs.requestId },
    { $push: { claimsToReview: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }
  );
};

export const indexClaimToSubmit = async (event: TracerEvent) => {
  const inputs = ClaimToSubmitEventSchema.parse(event.decoded.inputs);

  return mongo.serviceRequests.updateOne(
    { laborMarketAddress: event.contract.address as `0x${string}`, id: inputs.requestId },
    { $push: { claimsToSubmit: { signaler: inputs.signaler, signalAmount: inputs.signalAmount } } }
  );
};

const calculateRewardPools = (
  existingPools: LaborMarketDoc["serviceRequestRewardPools"],
  pToken: string,
  pTokenQuantity: string
) => {
  const newPools = [...existingPools];
  const pool = newPools.find((pool) => pool.pToken === pToken);
  if (pool) {
    pool.pTokenQuantity = BigNumber.from(pool.pTokenQuantity).add(pTokenQuantity).toString();
  } else {
    newPools.push({
      pToken: pToken as `0x${string}`,
      pTokenQuantity: pTokenQuantity,
    });
  }
  return newPools;
};
