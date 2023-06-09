import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { ReviewEventSchema } from "~/domain/review/schemas";
import { mongo } from "../../services/mongo.server";

export const indexerRequestReviewedEvent = async (event: TracerEvent) => {
  const contractAddress = getAddress(event.contract.address);
  const blockTimestamp = new Date(event.block.timestamp);
  const { submissionId, reviewer, reviewScore, requestId, uri } = ReviewEventSchema.parse(event.decoded.inputs);

  const submission = await mongo.submissions.findOne({
    laborMarketAddress: contractAddress,
    id: submissionId,
  });

  invariant(submission, "Submission not found when indexing review");

  await mongo.submissions.updateOne(
    { laborMarketAddress: contractAddress, id: submissionId },
    {
      $set: {
        score: {
          reviewCount: (submission.score?.reviewCount ?? 0) + 1,
          reviewSum: BigNumber.from(submission.score?.reviewSum ?? 0)
            .add(reviewScore)
            .toNumber(),
        },
      },
    }
  );

  await mongo.reviews.insertOne({
    laborMarketAddress: contractAddress,
    submissionId: submissionId,
    serviceRequestId: requestId,
    score: reviewScore,
    reviewer: reviewer,
    indexedAt: new Date(),
    blockTimestamp,
  });

  //log this event in user activity collection
  await mongo.userActivity.insertOne({
    groupType: "Review",
    eventType: {
      eventType: "RequestReviewed",
      config: {
        laborMarketAddress: contractAddress,
        requestId: requestId,
        submissionId: submissionId,
        title: submission?.appData?.title ?? "",
      },
    },
    iconType: "submission",
    actionName: "Submission",
    userAddress: reviewer,
    blockTimestamp,
    indexedAt: new Date(),
  });
};
