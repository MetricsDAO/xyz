import { useRouteData } from "remix-utils";
import { Badge, Card, UserBadge } from "~/components";
import type { findServiceRequest } from "~/services/service-request.server";
import { fromNow } from "~/utils/date";

export default function ServiceIdParticipants() {
  const data = useRouteData<{ serviceRequest: Awaited<ReturnType<typeof findServiceRequest>> }>(
    "routes/app/$mType/m/$laborMarketAddress.sr/$serviceRequestId"
  );
  if (!data) {
    throw new Error("ServiceIdParticipants must be rendered under a ServiceId route");
  }
  const { serviceRequest } = data;

  return (
    <section className="space-y-7">
      <p className="text-sm text-gray-700">
        Average user rMETRIC <Badge className="ml-2 px-5 text-gray-900">1,000</Badge>
      </p>

      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          {/* {serviceRequest?.submissions.map((s) => {
            return (
              <Card asChild className="px-6 py-4" key={s.contractId}>
                <div className="flex justify-between items-center">
                  <UserBadge address={s.creatorId as `0x${string}`} />
                  <p className="text-sm text-gray-500">{fromNow(s.createdAt)}</p>
                </div>
              </Card>
            );
          })} */}
        </main>
        <aside className="md:w-1/5">filters here</aside>
      </div>
    </section>
  );
}
