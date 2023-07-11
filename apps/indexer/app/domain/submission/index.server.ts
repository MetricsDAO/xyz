import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { EvmAddressSchema } from "~/domain/address";
import { fetchIpfsJson } from "~/services/ipfs.server";
import { logger } from "~/services/logger.server";
import { mongo } from "~/services/mongo.server";
import { nodeProvider } from "~/services/node.server";
import { fromUnixTimestamp } from "~/utils/date";
import { safeCreateEvent } from "../event/functions.server";
import type { Event } from "../event/schema";
import { getSubmission } from "./functions.server";
import type { SubmissionConfig } from "./schemas";
import { SubmissionConfigSchema } from "./schemas";

const BLOCK_LOOK_BACK = -150; // Look back 150 blocks (~5 minutes on Polygon)

export async function appRequestFulfilledEvent(event: Event) {
  const { blockNumber, transactionHash, address } = event;

  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.RequestFulfilled();
  const events = await contract.queryFilter(eventFilter, BLOCK_LOOK_BACK);
  const eventToIndex = events.find((e) => e.blockNumber === blockNumber && e.transactionHash === transactionHash);

  if (eventToIndex) {
    const block = await eventToIndex.getBlock();
    const args = SubmissionConfigSchema.parse({
      ...eventToIndex.args,
      requestId: eventToIndex.args.requestId.toString(),
      submissionId: eventToIndex.args.submissionId.toString(),
    });
    await indexRequestFulfilledEvent({
      name: "RequestFulfilled",
      address,
      blockNumber,
      blockTimestamp: fromUnixTimestamp(block.timestamp),
      transactionHash,
      args,
    });
    return;
  }
}

async function indexRequestFulfilledEvent(event: {
  name: string;
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: SubmissionConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    logger.info("Already seen a similar event. Skipping indexing.");
    return;
  }

  let appData;
  try {
    appData = await fetchIpfsJson(event.args.uri);
  } catch (e) {
    logger.warn(`Failed to fetch app data for submission ${event.args.submissionId}. Skipping indexing.`, e);
  }

  await mongo.submissions.insertOne({
    id: event.args.submissionId,
    laborMarketAddress: event.address,
    serviceRequestId: event.args.requestId,
    indexedAt: new Date(),
    configuration: event.args,
    appData,
    blockTimestamp: event.blockTimestamp,
  });

  const submission = await getSubmission(event.address, event.args.requestId, event.args.submissionId);
  invariant(submission, "Submission should exist after creation");

  // log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "Submission",
    eventType: {
      eventType: "RequestFulfilled",
      config: {
        laborMarketAddress: submission.laborMarketAddress,
        requestId: submission.serviceRequestId,
        submissionId: submission.id,
        title: submission.appData?.title ?? "",
      },
    },
    iconType: "submission",
    actionName: "Submission",
    userAddress: submission.configuration.fulfiller,
    blockTimestamp: submission.blockTimestamp,
    indexedAt: submission.indexedAt,
  });

  await mongo.serviceRequests.updateOne(
    { laborMarketAddress: submission.laborMarketAddress, id: submission.serviceRequestId },
    {
      $inc: {
        "indexData.submissionCount": 1,
      },
    }
  );
}

export const indexerRequestFulfilledEvent = async (event: TracerEvent) => {
  const config = SubmissionConfigSchema.parse(event.decoded.inputs);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);

  // create submission
  await indexRequestFulfilledEvent({
    name: "RequestFulfilled",
    address: laborMarketAddress,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: config,
  });
};
