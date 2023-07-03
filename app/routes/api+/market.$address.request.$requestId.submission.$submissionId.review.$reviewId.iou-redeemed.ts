import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden, notFound } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import { mongo } from "~/services/mongo.server";
import { requireUser } from "~/services/session.server";

const paramSchema = z.object({
  address: EvmAddressSchema,
  requestId: z.string(),
  submissionId: z.string(),
  reviewId: z.string(),
});
// Mark a review as having been redeemed. To be called by the client after a redemption has been performed.
// This is a best effort to prevent the "duplicate redeem" problem.
export async function action({ request, params }: DataFunctionArgs) {
  const user = await requireUser(request);
  const { address, requestId, submissionId, reviewId } = getParamsOrFail(params, paramSchema);

  const review = await mongo.reviews.findOne({
    laborMarketAddress: address,
    serviceRequestId: requestId,
    submissionId: submissionId,
    id: reviewId,
  });

  if (!review) {
    throw notFound("Review not found");
  }

  if (review.reviewer !== user.address) {
    throw forbidden("You do not have permission to mark this review as IOU redeemed");
  }

  console.log("review", review);
  return await mongo.reviews.updateOne(
    {
      laborMarketAddress: address,
      serviceRequestId: requestId,
      submissionId: submissionId,
      id: reviewId,
    },
    {
      $set: {
        reward: {
          ...review.reward,
          iouClientTransactionSuccess: true,
        },
      },
    }
  );
}
