import { Link } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import { EvmAddressSchema } from "~/domain/address";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { findServiceRequest } from "~/domain/service-request/functions.server";
import { ClaimToSubmitCreator } from "~/features/claim-to-submit-creator/claim-to-submit-creator";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { requestId, address } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  const laborMarket = await getLaborMarket(address);
  if (!laborMarket) {
    throw notFound({ address });
  }
  if (!serviceRequest) {
    throw notFound({ id: requestId });
  }
  if (!laborMarket) {
    throw notFound({ address });
  }

  return typedjson({ serviceRequest, laborMarket }, { status: 200 });
};

export default function ClaimToSubmit() {
  const { serviceRequest } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="max-w-4xl space-y-7 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {serviceRequest.appData?.title}</h1>
        <h2 className="text-lg text-cyan-500">Claiming is an up front commitment to submit at least one dashboard</h2>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="font-semibold pr-10">Claim to Submit Deadline</h2>
            <CountdownCard start={serviceRequest.blockTimestamp} end={serviceRequest.configuration?.signalExp} />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold pr-16">Submission Deadline</h2>
            <CountdownCard start={serviceRequest.blockTimestamp} end={serviceRequest.configuration?.submissionExp} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        <ClaimToSubmitCreator
          serviceRequest={serviceRequest}
          confirmationMessage={
            <div className="space-y-8">
              <p className="mt-2">Please confirm that you would like to claim a submission.</p>
            </div>
          }
        />
        <Button size="lg" variant="cancel" asChild>
          <Link to={`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}`}>Cancel</Link>
        </Button>
      </div>
      <div className="invisible"></div>
    </Container>
  );
}
