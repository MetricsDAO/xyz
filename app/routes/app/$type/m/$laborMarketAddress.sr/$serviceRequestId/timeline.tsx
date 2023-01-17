import { useRouteData } from "remix-utils";
import { CountdownCard } from "~/components/countdown-card";
import type { findServiceRequest } from "~/services/service-request.server";

export default function ServiceIdTimeline() {
  const data = useRouteData<{ serviceRequest: Awaited<ReturnType<typeof findServiceRequest>> }>(
    "routes/app/$type/m/$laborMarketAddress.sr/$serviceRequestId"
  );
  if (!data) {
    throw new Error("ServiceIdTimeline must be rendered under a ServiceId route");
  }
  // const { serviceRequest } = data;

  return (
    <section className="w-full border-spacing-4 border-separate space-y-4">
      <h3 className="font-semibold">Upcoming</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountdownCard start={"2023-01-25"}>claim to submit deadline</CountdownCard>
        <CountdownCard start={"2023-01-25"}>submission deadline</CountdownCard>
        <CountdownCard start={"2023-01-25"}>claim to review deadline</CountdownCard>
        <CountdownCard start={"2023-01-25"}>review deadline &amp; winners</CountdownCard>
      </div>
      <h3 className="font-semibold">Passed</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountdownCard start={"2023-01-25"}>submissions open</CountdownCard>
      </div>
    </section>
  );
}
