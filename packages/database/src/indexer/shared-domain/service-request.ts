import invariant from "tiny-invariant";
// import { logger } from "~/services/logger.server";
import { mongo } from "../mongo";
import {
  EvmAddress,
  RewardPool,
  ServiceRequestAppData,
  ServiceRequestAppDataSchema,
  ServiceRequestBase,
  ServiceRequestConfig,
  ServiceRequestDoc,
} from "@mdao/schema";
import { safeCreateEvent } from "./event";
import { fetchIpfsJson } from "../../ipfs";
import { BigNumber } from "ethers";

export async function indexServiceRequestEvent(event: {
  name: string;
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: ServiceRequestConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    console.info("Already seen a similar event. Skipping indexing.");
    return;
  }
  await createServiceRequest({
    id: event.args.requestId,
    laborMarketAddress: event.address,
    blockTimestamp: event.blockTimestamp,
    configuration: event.args,
  });
  const sr = await getServiceRequest(event.address, event.args.requestId);
  invariant(sr, "Service request should exist after creation");

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "ServiceRequest",
    eventType: {
      eventType: "RequestConfigured",
      config: {
        laborMarketAddress: sr.laborMarketAddress,
        requestId: sr.id,
        title: sr.appData.title,
      },
    },
    iconType: "service-request",
    actionName: "Launch Challenge",
    userAddress: sr.configuration.requester,
    blockTimestamp: sr.blockTimestamp,
    indexedAt: sr.indexData.indexedAt,
  });

  // Update labor market
  const lm = await mongo.laborMarkets.findOne({ address: sr.laborMarketAddress });
  const rewardPools = calculateRewardPools(
    lm?.indexData.serviceRequestRewardPools ?? [],
    sr.configuration.pTokenProvider,
    sr.configuration.pTokenProviderTotal
  );

  await mongo.laborMarkets.updateOne(
    { address: sr.laborMarketAddress },
    {
      $inc: {
        "indexData.serviceRequestCount": 1,
      },
      $set: {
        "indexData.serviceRequestRewardPools": rewardPools,
      },
    }
  );
}

export async function createServiceRequest(serviceRequest: ServiceRequestBase) {
  const { id, configuration, laborMarketAddress, blockTimestamp } = serviceRequest;
  const appData = await getIndexedServiceRequestAppData(configuration.uri);

  await mongo.serviceRequests.insertOne({
    id,
    laborMarketAddress,
    blockTimestamp,
    configuration,
    appData,
    indexData: {
      indexedAt: new Date(),
      claimsToReview: [],
      claimsToSubmit: [],
      submissionCount: 0,
    },
  });
}

async function getIndexedServiceRequestAppData(marketUri: string): Promise<ServiceRequestAppData> {
  const data = await fetchIpfsJson(marketUri);
  return ServiceRequestAppDataSchema.parse(data);
}

export const calculateRewardPools = (
  existingPools: RewardPool[],
  pToken: EvmAddress,
  pTokenQuantity: string
): RewardPool[] => {
  const newPools = [...existingPools];
  const pool = newPools.find((pool) => pool.pToken === pToken);
  if (pool) {
    pool.pTokenQuantity = BigNumber.from(pool.pTokenQuantity).add(pTokenQuantity).toString();
  } else {
    newPools.push({
      pToken: pToken,
      pTokenQuantity: pTokenQuantity,
    });
  }
  return newPools;
};

async function getServiceRequest(laborMarketAddress: EvmAddress, id: string): Promise<ServiceRequestDoc | null> {
  return await mongo.serviceRequests.findOne({ laborMarketAddress, id });
}
