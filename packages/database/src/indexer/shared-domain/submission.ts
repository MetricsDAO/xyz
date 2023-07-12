import invariant from "tiny-invariant";
// import { logger } from "~/services/logger.server";
import { EvmAddress, SubmissionConfig } from "@mdao/schema";
import { safeCreateEvent } from "./event";
import { fetchIpfsJson } from "../../ipfs";
import { mongo } from "../mongo";

export async function indexSubmissionEvent(event: {
  name: string;
  address: EvmAddress;
  blockNumber: number;
  blockTimestamp: Date;
  transactionHash: string;
  args: SubmissionConfig;
}) {
  const isNewEvent = await safeCreateEvent(event);
  if (!isNewEvent) {
    console.info("Already seen a similar event. Skipping indexing.");
    return;
  }

  let appData;
  try {
    appData = await fetchIpfsJson(event.args.uri);
  } catch (e) {
    console.warn(`Failed to fetch app data for submission ${event.args.submissionId}. Skipping indexing.`, e);
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

async function getSubmission(laborMarketAddress: EvmAddress, serviceRequestId: string, submissionId: string) {
  return await mongo.submissions.findOne({ laborMarketAddress, serviceRequestId, id: submissionId });
}
