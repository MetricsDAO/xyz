import { useRouteData } from "remix-utils";
import { CountDownCard } from "~/components/CountDownCard";
import type { findChallenge } from "~/services/challenges-service.server";

export default function ChallengeIdPrereqs() {
  const data = useRouteData<{ challenge: Awaited<ReturnType<typeof findChallenge>> }>("routes/app/brainstorm/c/$id");
  if (!data) {
    throw new Error("ChallengeIdPrereqs must be rendered under a ChallengeId route");
  }
  const { challenge } = data;

  return (
    <section className="w-full border-spacing-4 border-separate space-y-4">
      <h3 className="font-semibold">Upcoming</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountDownCard progress={10} time={"2023-01-25"}>
          claim to submit deadline
        </CountDownCard>
        <CountDownCard progress={43} time={"2023-01-25"}>
          submission deadline
        </CountDownCard>
        <CountDownCard progress={22} time={"2023-01-25"}>
          claim to review deadline
        </CountDownCard>
        <CountDownCard progress={61} time={"2023-01-25"}>
          review deadline &amp; winners
        </CountDownCard>
      </div>
      <h3 className="font-semibold">Passed</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountDownCard progress={100} time={"2023-01-25"}>
          submissions open
        </CountDownCard>
      </div>
    </section>
  );
}
