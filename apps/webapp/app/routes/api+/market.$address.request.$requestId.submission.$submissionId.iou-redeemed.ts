import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden, notFound } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import { mongo } from "~/services/mongo.server";
import { requireUser } from "~/services/session.server";

const paramSchema = z.object({
  address: EvmAddressSchema,
  requestId: z.string(),
  submissionId: z.string(),
});
// Mark as submission as having been redeemed. To be called by the client after a redemption has been performed.
// This is a best effort to prevent the "duplicate redeem" problem.
export async function action({ request, params }: DataFunctionArgs) {
  const user = await requireUser(request);
  const { address, requestId, submissionId } = getParamsOrFail(params, paramSchema);

  const submission = await mongo.submissions.findOne({
    laborMarketAddress: address,
    serviceRequestId: requestId,
    id: submissionId,
  });

  if (!submission) {
    throw notFound("Submission not found");
  }

  if (submission.configuration.fulfiller !== user.address) {
    throw forbidden("You do not have permission to mark this submission as IOU redeemed");
  }

  invariant(submission.reward, "Submission reward must be defined");
  return await mongo.submissions.updateOne(
    {
      laborMarketAddress: address,
      serviceRequestId: requestId,
      id: submissionId,
    },
    {
      $set: {
        reward: {
          ...submission.reward,
          iouClientTransactionSuccess: true,
        },
      },
    }
  );
}
