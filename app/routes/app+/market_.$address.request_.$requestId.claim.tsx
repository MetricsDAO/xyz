import { Link } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { findServiceRequest } from "~/domain/service-request/functions.server";
import { ClaimToSubmitCreator } from "~/features/claim-to-submit-creator/claim-to-submit-creator";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { requestId, address } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  const laborMarket = await getIndexedLaborMarket(address);
  if (!serviceRequest) {
    throw notFound({ id: requestId });
  }
  if (!laborMarket) {
    throw notFound({ address });
  }

  return typedjson({ serviceRequest, laborMarket }, { status: 200 });
};

export default function ClaimToSubmit() {
  const { serviceRequest, laborMarket } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="max-w-4xl space-y-7 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {serviceRequest.appData?.title}</h1>
        <h2 className="text-lg text-cyan-500">Claiming is an up front commitment to submit at least one dashboard</h2>
        <p className="text-gray-500 text-sm">
          You must temporarily lock rMETRIC to claim. If you claim and don't submit before the deadline, all your locked
          rMETRIC will be slashed.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">How Claiming to Submit Works</h3>
        <ul className="list-disc list-inside text-gray-500 space-y-1 text-sm">
          <li>Commit to entering at least one submission by locking rMETRIC against this challenge</li>
          <li>Enter at least one submission before the submission deadline</li>
          <li>If you submit before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't submit before the deadline, all your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="font-semibold pr-10">Claim to Submit Deadline</h2>
            <CountdownCard
              start={serviceRequest.createdAtBlockTimestamp}
              end={serviceRequest.configuration?.signalExp}
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold pr-16">Submission Deadline</h2>
            <CountdownCard
              start={serviceRequest.createdAtBlockTimestamp}
              end={serviceRequest.configuration?.submissionExp}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Lock rMETRIC</h2>
        <p className="mt-2 text-gray-500 italic text-sm">
          Important: You must lock {laborMarket.configuration.reputationParams.submitMin} rMETRIC as defined by the
          Marketplace. If you don’t submit before the deadline, all{" "}
          {laborMarket.configuration.reputationParams.submitMin} of your locked rMETRIC will be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <ClaimToSubmitCreator
          serviceRequest={serviceRequest}
          confirmationMessage={
            <div className="space-y-8">
              <p className="mt-2">Please confirm that you would like to claim a submission.</p>
              <p>
                This will lock <b>{laborMarket.configuration.reputationParams.submitMin} rMETRIC.</b>
              </p>
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
