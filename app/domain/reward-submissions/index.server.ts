import { getAddress } from "ethers/lib/utils.js";
import type { TracerEvent } from "pinekit/types";
import invariant from "tiny-invariant";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { RequestPayClaimedEventSchema } from "./schema";

export async function indexerRequestPayClaimedEvent(event: TracerEvent) {
  const laborMarketAddress = getAddress(event.contract.address);
  const args = RequestPayClaimedEventSchema.parse(event.decoded.inputs);

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress,
    id: args.requestId,
  });
  invariant(serviceRequest, "Service request should exist");

  const tokens = await listTokens();
  const token = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenProvider);

  await mongo.submissions.updateOne(
    {
      laborMarketAddress,
      serviceRequestId: args.requestId,
      id: args.submissionId,
    },
    {
      $set: {
        rewardClaimed: true,
        reward: {
          tokenAmount: args.payAmount,
          tokenAddress: serviceRequest.configuration.pTokenProvider,
          isIou: token?.isIou,
        },
      },
    }
  );
}
