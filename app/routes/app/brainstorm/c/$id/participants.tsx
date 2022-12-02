import { Link } from "@remix-run/react";
import { UserBadge } from "~/components/UserBadge";
import { Badge } from "~/components/Badge";
import { Card } from "~/components/Card";
import { useRouteData } from "remix-utils";
import type { findChallenge } from "~/services/challenges-service.server";
import { fromNow } from "~/utils/date";

export default function ChallengeIdParticipants() {
  const data = useRouteData<{ challenge: Awaited<ReturnType<typeof findChallenge>> }>("routes/app/brainstorm/c/$id");
  if (!data) {
    throw new Error("ChallengeIdPrereqs must be rendered under a ChallengeId route");
  }
  const { challenge } = data;

  return (
    <section className="space-y-7">
      <p className="text-sm text-gray-700">
        Average user rMETRIC <Badge className="ml-2 px-5 text-gray-900">1,000</Badge>
      </p>

      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          {challenge?.submissions.map((s) => {
            return (
              <Card asChild className="px-6 py-4" key={s.id}>
                <Link to="/u/0x123" className="flex justify-between items-center">
                  <UserBadge url="u/id" name="jo.Eth" balance={200} />
                  <p className="text-sm text-gray-500">{fromNow(s.createdAt)}</p>
                </Link>
              </Card>
            );
          })}
        </main>
        <aside className="md:w-1/5">filters here</aside>
      </div>
    </section>
  );
}
