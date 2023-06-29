import invariant from "tiny-invariant";
import { EvmAddressSchema } from "~/domain/address";
import { mongo } from "~/services/mongo.server";
import { createSubmission, getSubmission } from "./functions.server";
import { SubmissionConfigSchema } from "./schemas";
import { logger } from "~/services/logger.server";
import { nodeProvider } from "~/services/node.server";
import { LaborMarket__factory } from "~/contracts";
import { safeCreateEvent } from "../event/functions.server";
import { fromUnixTimestamp } from "~/utils/date";
import type { TracerEvent } from "pinekit/types";
import type { Event } from "../event/schema";
import type { SubmissionConfig } from "./schemas";
import type { EvmAddress } from "~/domain/address";

const BLOCK_LOOK_BACK = -150; // Look back 150 blocks (~5 minutes on Polygon)

export async function appRequestFulfilledEvent(event: Event) {
  const { blockNumber, transactionHash, address } = event;

  const contract = LaborMarket__factory.connect(address, nodeProvider);
  const eventFilter = contract.filters.RequestFulfilled();
  const events = await contract.queryFilter(eventFilter, BLOCK_LOOK_BACK);
  const eventToIndex = events.find((e) => e.blockNumber === blockNumber && e.transactionHash === transactionHash);

  if (eventToIndex) {
    const block = await eventToIndex.getBlock();
    const args = SubmissionConfigSchema.parse(eventToIndex.args);
    await indexRequestFulfilledEvent({
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

  await createSubmission(event.address, event.blockTimestamp, event.args);
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
    address: laborMarketAddress,
    blockNumber: event.block.number,
    blockTimestamp: new Date(event.block.timestamp),
    transactionHash: event.txHash,
    args: config,
  });
};
