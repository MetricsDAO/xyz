import { useRouteData } from "remix-utils";
import { CountdownCard } from "~/components/countdown-card";
import type { findServiceRequest } from "~/services/service-request.server";
import { claimToReviewDate, dateHasPassed } from "~/utils/date";

export default function ServiceIdTimeline() {
  const data = useRouteData<{ serviceRequest: Awaited<ReturnType<typeof findServiceRequest>> }>(
    "routes/app/$mType/m/$laborMarketAddress.sr/$serviceRequestId"
  );
  if (!data) {
    throw new Error("ServiceIdTimeline must be rendered under a ServiceId route");
  }
  const { serviceRequest } = data;
  if (!serviceRequest) {
    throw new Error("ServiceRequest not found");
  }

  const times = [
    { label: "claim to submit deadline", time: serviceRequest.configuration?.signalExpiration },
    { label: "submissions open", time: serviceRequest.configuration?.signalExpiration },
    { label: "submission deadline", time: serviceRequest.configuration?.submissionExpiration },
    {
      label: "claim to review deadline",
      time: claimToReviewDate(
        serviceRequest.createdAtBlockTimestamp,
        serviceRequest.configuration?.enforcementExpiration
      ),
    },
    { label: "review deadline & winners", time: serviceRequest.configuration?.enforcementExpiration },
  ];

  const upcoming = times.filter((t) => t.time && !dateHasPassed(t.time));
  const passed = times.filter((t) => t.time && dateHasPassed(t.time));

  return (
    <section className="w-full border-spacing-4 border-separate space-y-14">
      {upcoming.length === 0 ? (
        <></>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upcoming</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {upcoming.map((u) => (
              <CountdownCard start={serviceRequest.createdAtBlockTimestamp} end={u.time} key={u.label}>
                {u.label}
              </CountdownCard>
            ))}
          </div>
        </div>
      )}
      {passed.length === 0 ? (
        <></>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Passed</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {passed.map((p) => (
              <CountdownCard start={serviceRequest.createdAtBlockTimestamp} end={p.time} key={p.label}>
                {p.label}
              </CountdownCard>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
