import { useRouteData } from "remix-utils";
import invariant from "tiny-invariant";
import { Badge, CurveChart } from "~/components";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import { RewardBadge } from "~/components/reward-badge";
import type { getLaborMarket } from "~/domain/labor-market/functions.server";
import type { findServiceRequest } from "~/domain/service-request/functions.server";
import { useTokens } from "~/hooks/use-root-data";
import type { listTokens } from "~/services/tokens.server";
import { REPUTATION_REWARD_POOL } from "~/utils/constants";
import { fromTokenAmount, toTokenAbbreviation } from "~/utils/helpers";

export default function ChallengeIdRewards() {
  const data = useRouteData<{
    laborMarket: Awaited<ReturnType<typeof getLaborMarket>>;
    serviceRequest: Awaited<ReturnType<typeof findServiceRequest>>;
    tokens: Awaited<ReturnType<typeof listTokens>>;
  }>("routes/app+/market_.$address.request.$requestId");

  if (!data) {
    throw new Error("ServiceIdParticipants must be rendered under a ServiceId route");
  }
  const { serviceRequest, laborMarket } = data;
  invariant(serviceRequest, "serviceRequest must be specified");
  invariant(laborMarket, "laborMarket must be specified");

  const tokens = useTokens();
  const providerToken = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenProvider);
  const reviewerToken = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenProvider);

  return (
    <section className="space-y-3 w-full border-spacing-4 border-separate md:w-4/5">
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Pool</h3>
        <Detail>
          <DetailItem title="Total rewards to be distributed across analysts">
            <RewardBadge
              payment={{
                amount: fromTokenAmount(
                  serviceRequest.configuration.pTokenProviderTotal,
                  providerToken?.decimals ?? 18
                ),
                token: providerToken,
              }}
              reputation={{ amount: REPUTATION_REWARD_POOL.toLocaleString() }}
            />
          </DetailItem>
        </Detail>
      </Card>
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reward Curve</h3>
        <Detail>
          <DetailItem title="How the reward pool is distributed">
            <CurveChart
              token={toTokenAbbreviation(serviceRequest.configuration.pTokenProvider, tokens) ?? ""}
              amount={serviceRequest.configuration.pTokenProviderTotal}
              type={laborMarket.appData.enforcement}
              decimals={providerToken?.decimals}
            />
          </DetailItem>
        </Detail>
      </Card>
      <Card className="p-6">
        <h3 className="font-medium mb-4">Reviewer Rewards</h3>
        <Detail>
          <DetailItem title="Total rewards to be distributed across reviewers">
            <Badge>{`${fromTokenAmount(
              serviceRequest.configuration.pTokenReviewerTotal,
              reviewerToken?.decimals ?? 18
            )} ${toTokenAbbreviation(serviceRequest.configuration.pTokenReviewer, tokens)}`}</Badge>
          </DetailItem>
        </Detail>
      </Card>
    </section>
  );
}
