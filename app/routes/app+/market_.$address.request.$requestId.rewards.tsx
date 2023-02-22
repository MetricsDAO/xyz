import { useRouteData } from "remix-utils";
import invariant from "tiny-invariant";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import { RewardBadge } from "~/components/reward-badge";
import type { findServiceRequest } from "~/services/service-request.server";
import type { listTokens } from "~/services/tokens.server";
import { REPUTATION_REWARD_POOL } from "~/utils/constants";
import { fromTokenAmount, toTokenAbbreviation } from "~/utils/helpers";

export default function ChallengeIdRewards() {
  const data = useRouteData<{
    serviceRequest: Awaited<ReturnType<typeof findServiceRequest>>;
    tokens: Awaited<ReturnType<typeof listTokens>>;
  }>("routes/app+/market_.$address.request.$requestId");

  if (!data) {
    throw new Error("ServiceIdParticipants must be rendered under a ServiceId route");
  }
  const { serviceRequest, tokens } = data;
  invariant(serviceRequest, "serviceRequest must be specified");

  return (
    <section className="space-y-3 w-full border-spacing-4 border-separate md:w-4/5">
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Pool</h3>
        <Detail>
          <DetailItem title="Total rewards to be distributed across winners">
            <RewardBadge
              amount={fromTokenAmount(serviceRequest.configuration.pTokenQuantity)}
              token={toTokenAbbreviation(serviceRequest.configuration.pToken, tokens) ?? ""}
              rMETRIC={REPUTATION_REWARD_POOL}
            />
          </DetailItem>
        </Detail>
      </Card>

      {/* MVP Hide */}
      {/* <Card className="p-6">
        <h3 className="font-medium mb-4">Your Projected Rewards</h3>
        <Detail>
          <DetailItem title="Estimated avg. rewards based on current claims to submit (may fluctuate)">
            <RewardBadge amount={20} token="SOL" rMETRIC={100} />
          </DetailItem>
        </Detail>
      </Card> */}

      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Curve</h3>
        <Detail>
          <DetailItem title="How the reward pool is distributed">
            <div className="flex space-x-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-600 rounded px-1">Reward by Overall Score</span>
              <p>Rewards are distributed based on overall submission scores. Higher scores are rewarded more.</p>
            </div>
          </DetailItem>
        </Detail>
      </Card>
    </section>
  );
}
