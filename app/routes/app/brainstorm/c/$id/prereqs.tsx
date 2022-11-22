import { useRouteData } from "remix-utils";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";
import { Card } from "~/components/Card";
import { Detail, DetailItem } from "~/components/detail";
import type { findChallenge } from "~/services/challenges-service.server";

export default function ChallengeIdPrereqs() {
  const data = useRouteData<{ challenge: Awaited<ReturnType<typeof findChallenge>> }>("routes/app/brainstorm/c/$id");
  if (!data) {
    throw new Error("ChallengeIdPrereqs must be rendered under a ChallengeId route");
  }
  const { challenge } = data;

  return (
    <section>
      <p className="text-gray-500 text-sm mb-6">
        What you must hold in your connected wallet to perform various actions on this challenge
      </p>

      <div className="space-y-3">
        <Card className="p-5">
          <h3 className="font-medium mb-4">You must hold this much rMETRIC to enter submissions for this challenge</h3>
          <Detail>
            <DetailItem title="Min Balance">
              <Badge>{challenge?.laborMarket.submitRepMin} rMETRIC</Badge>
            </DetailItem>
            <DetailItem title="Max Balance">
              <Badge>{challenge?.laborMarket.submitRepMax} rMETRIC</Badge>
            </DetailItem>
          </Detail>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium mb-4">
            You must hold this badge to review and score submissions on this challenge
          </h3>
          <Detail>
            <DetailItem title="MDAO S4 Reviewer Badge">
              <Badge className="pl-2 flex space-x-1">
                <Avatar />
                <span>0x12345</span>
              </Badge>
            </DetailItem>
          </Detail>
        </Card>
      </div>
    </section>
  );
}
