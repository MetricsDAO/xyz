import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";

export default function ChallengeIdRewards() {
  return (
    <section className="space-y-3 w-full border-spacing-4 border-separate md:w-4/5">
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Pool</h3>
        <Detail>
          <DetailItem title="Total rewards to be distributed across winners">
            <Badge className="bg-gray-300 pl-0">
              <Badge className="mr-2">20 SOL</Badge> 100 rMETRIC
            </Badge>
          </DetailItem>
        </Detail>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Your Projected Rewards</h3>
        <Detail>
          <DetailItem title="Estimated avg. rewards based on current claims to submit (may fluctuate)">
            <Badge className="bg-gray-300 pl-0">
              <Badge className="mr-2">20 SOL</Badge> 100 rMETRIC
            </Badge>
          </DetailItem>
        </Detail>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Curve</h3>
        <Detail>
          <DetailItem title="How the reward pool is distributed">
            <div className="flex space-x-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-600 rounded px-1">Aggressive</span>
              <p>Rewards the top 10% of submissions. Winners are determined through peer review</p>
            </div>
          </DetailItem>
        </Detail>
      </Card>
    </section>
  );
}
