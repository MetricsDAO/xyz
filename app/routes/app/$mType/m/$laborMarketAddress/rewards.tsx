import { RewardBadge } from "~/components/reward-badge";
import { Card } from "~/components/card";
import { Badge } from "~/components/badge";
import { useRouteData } from "remix-utils";
import type { findLaborMarket } from "~/services/labor-market.server";
import invariant from "tiny-invariant";
import type { listTokens } from "~/services/tokens.server";
import { ChallengePoolBadges } from "~/features/challenge-pool-badges";

export default function MarketplaceIdRewards() {
  const data = useRouteData<{
    laborMarket: Awaited<ReturnType<typeof findLaborMarket>>;
    tokens: Awaited<ReturnType<typeof listTokens>>;
  }>("routes/app/$mType/m/$laborMarketAddress");
  if (!data) {
    throw new Error("MarketplaceIdPrerequesites must be rendered under a MarketplaceId route");
  }
  const { laborMarket, tokens } = data;

  invariant(laborMarket, "No labormarket found");

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate space-y-4 md:w-4/5">
            <p className="text-sm text-gray-500">
              How rewards are distributed for all challenges in this challenge marketplace and how liquid it currently
              is
            </p>
            <Card className="p-4 space-around space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Challenge Pools Total</p>
              <p className="text-xs text-gray-500">SUM OF ALL ACTIVE CHALLENGE REWARD POOLS</p>
              <ChallengePoolBadges pools={laborMarket.serviceRequestRewardPools} tokens={tokens} />
            </Card>
            {/* MVP Hide */}
            {/* <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Avg. Challenge Pool</p>
              <p className="text-xs text-gray-500">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </p>
              <RewardBadge amount={"100"} token="USD" rMETRIC={50} />
            </Card> */}
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Curve</p>
              <p className="text-xs text-gray-500">HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED</p>
              <div className="flex flex-row items-center space-x-3 mt-1">
                <Badge>Aggresive</Badge>
                <p className="text-xs">
                  Rewards the top 10% of submissions for each challenge. Winners are determined through peer review
                </p>
              </div>
            </Card>
            {/* MVP Hide */}
            {/* <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Tokens</p>
              <p className="text-xs text-gray-500">TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE</p>
              <p className="flex flex-row space-x-3 mt-1">{/* <TokenBadge slug="Solana" /></p>
            </Card> */}
          </div>
        </div>
      </main>
    </section>
  );
}
