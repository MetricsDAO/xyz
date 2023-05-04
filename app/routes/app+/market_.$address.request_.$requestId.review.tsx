import type { DataFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Container } from "~/components/container";
import { findServiceRequest } from "~/domain/service-request/functions.server";
import { ClaimToReviewCreator } from "~/features/claim-to-review-creator/claim-to-review-creator";
import { connectToDatabase } from "~/services/mongo.server";
import { pineConfig } from "~/utils/pine-config.server";

const paramsSchema = z.object({ address: z.string(), requestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const client = await connectToDatabase();
  const pine = pineConfig();
  const db = client.db(`${pine.namespace}-${pine.subscriber}`);
  const { address, requestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  if (!serviceRequest) {
    throw notFound({ requestId });
  }

  return typedjson({ serviceRequest }, { status: 200 });
};

export default function ClaimToReview() {
  const { serviceRequest } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <ClaimToReviewCreator serviceRequest={serviceRequest} />
    </Container>
  );
}
