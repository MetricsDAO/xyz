import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { EvmAddressSchema } from "~/domain/address";
import { mongo } from "~/services/mongo.server";
import { createSubmission, getSubmission } from "./functions.server";
import { SubmissionConfigSchema } from "./schemas";

export const indexerRequestFulfilledEvent = async (event: TracerEvent) => {
  const config = SubmissionConfigSchema.parse(event.decoded.inputs);
  const laborMarketAddress = EvmAddressSchema.parse(event.contract.address);

  await createSubmission(laborMarketAddress, new Date(event.block.timestamp), config);
  const submission = await getSubmission(laborMarketAddress, config.requestId, config.submissionId);
  invariant(submission, "Submission should exist after creation");

  //log this event in user activity collection
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
    indexedAt: new Date(),
  });

  await mongo.serviceRequests.updateOne(
    { laborMarketAddress: submission.laborMarketAddress, id: submission.serviceRequestId },
    {
      $inc: {
        submissionCount: 1,
      },
    }
  );
};
