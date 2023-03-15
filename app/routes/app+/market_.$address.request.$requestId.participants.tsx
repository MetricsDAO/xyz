import { useRouteData } from "remix-utils";
import type { findServiceRequest } from "~/services/service-request.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { Badge, Card, UserBadge } from "~/components";
import { SubmissionSearchSchema } from "~/domain/submission";
import { getParamsOrFail } from "remix-params-helper";
import { searchSubmissions } from "~/services/submissions.server";
import { fromNow } from "~/utils/date";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.serviceRequestId, "serviceRequestId is required");
  invariant(params.laborMarketAddress, "laborMarketAddress is required");
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, SubmissionSearchSchema);
  const submissions = await searchSubmissions({
    ...search,
    laborMarketAddress: params.laborMarketAddress,
    serviceRequestId: params.serviceRequestId,
  });
  return typedjson({ submissions });
};

export default function ServiceIdParticipants() {
  const data = useRouteData<{ serviceRequest: Awaited<ReturnType<typeof findServiceRequest>> }>(
    "routes/app+/market_.$address.request.$requestId"
  );
  if (!data) {
    throw new Error("ServiceIdParticipants must be rendered under a ServiceId route");
  }
  const { submissions } = useTypedLoaderData<typeof loader>();

  if (submissions.length === 0) {
    return <p>Please submit!</p>;
  }

  return (
    <section className="space-y-7">
      <p className="text-sm text-gray-700">
        Average user rMETRIC <Badge className="ml-2 px-5 text-gray-900">--</Badge>
      </p>

      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          {submissions.map((s) => {
            return (
              <Card asChild className="px-6 py-4" key={s.configuration.serviceProvider}>
                <div className="flex justify-between items-center">
                  <UserBadge address={s.configuration.serviceProvider as `0x${string}`} />
                  <p className="text-sm text-gray-500">{fromNow(s.createdAtBlockTimestamp)}</p>
                </div>
              </Card>
            );
          })}
        </main>
        <aside className="md:w-1/5">filters here</aside>
      </div>
    </section>
  );
}
