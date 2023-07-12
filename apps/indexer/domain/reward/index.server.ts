import { mongo, prisma } from "@mdao/database";
import type { TracerEvent } from "@mdao/pinekit";
import { RequestPayClaimedEventSchema } from "@mdao/schema";
import { getAddress } from "ethers/lib/utils.js";
import invariant from "tiny-invariant";

export async function indexerRequestPayClaimedEvent(event: TracerEvent) {
  const laborMarketAddress = getAddress(event.contract.address);
  const args = RequestPayClaimedEventSchema.parse(event.decoded.inputs);

  const serviceRequest = await mongo.serviceRequests.findOne({
    laborMarketAddress,
    id: args.requestId,
  });
  invariant(serviceRequest, "Service request should exist");

  const tokens = await prisma.token.findMany();
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
