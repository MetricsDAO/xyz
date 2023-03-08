import { Card } from "~/components/card";
import { ChallengePoolBadges } from "~/features/challenge-pool-badges";
import { useMarketAddressData } from "~/hooks/use-market-address-data";

export default function MarketplaceIdRewards() {
  const { laborMarket, tokens } = useMarketAddressData();

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
              <ChallengePoolBadges pools={laborMarket.indexData.serviceRequestRewardPools} tokens={tokens} />
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
              <div className="flex flex-row items-center space-x-3 mt-1 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-600 rounded px-1">Reward by Overall Score</span>
                <p>Rewards are distributed based on overall submission scores. Higher scores are rewarded more.</p>
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
