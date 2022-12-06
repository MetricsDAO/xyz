import { useRouteData } from "remix-utils";
import { CountdownCard } from "~/components/countdown-card";
import type { findChallenge } from "~/services/challenges-service.server";

export default function ChallengeIdPrereqs() {
  const data = useRouteData<{ challenge: Awaited<ReturnType<typeof findChallenge>> }>("routes/app/brainstorm/c/$id");
  if (!data) {
    throw new Error("ChallengeIdPrereqs must be rendered under a ChallengeId route");
  }
  //const { challenge } = data;

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
