import { useRouteData } from "remix-utils";
import { Badge, Card, UserBadge } from "~/components";
import type { findChallenge } from "~/services/challenges-service.server";
import { fromNow } from "~/utils/date";

export default function ChallengeIdParticipants() {
  const data = useRouteData<{ challenge: Awaited<ReturnType<typeof findChallenge>> }>("routes/app/$type/c/$id");
  if (!data) {
    throw new Error("ChallengeIdParticpants must be rendered under a ChallengeId route");
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
                <div className="flex justify-between items-center">
                  <UserBadge url="u/id" address="0x983110309620D911731Ac0932219af06091b6744" balance={200} />
                  <p className="text-sm text-gray-500">{fromNow(s.createdAt)}</p>
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
