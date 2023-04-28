import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden, notFound } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import env from "~/env.server";
import { mongo } from "~/services/mongo.server";

const paramSchema = z.object({ address: EvmAddressSchema, id: z.string() });
export async function loader({ request, params }: DataFunctionArgs) {
  const apiKey = request.headers.get("x-api-key");

  if (env.FLIPSIDE_API_KEY !== apiKey) {
    throw forbidden({ error: "Not allowed" });
  }

  const { address, id } = getParamsOrFail(params, paramSchema);

  const submission = await mongo.submissions.findOne({ id, laborMarketAddress: address });

  if (!submission) {
    throw notFound({ error: "Submission not found" });
  }

  const serviceRequest = await mongo.serviceRequests.findOne({ id: submission.serviceRequestId });

  return {
    ...submission,
    serviceRequest,
  };
}
