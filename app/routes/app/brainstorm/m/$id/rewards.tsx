import { Badge } from "~/components/badge";
import { Card } from "~/components/Card";

export default function MarketplaceIdRewards() {
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
              <Badge className="bg-gray-200">
                <Badge className="bg-gray-100">100 USD</Badge> 500 rMETRIC
              </Badge>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Avg. Challenge Pool</p>
              <p className="text-xs text-gray-500">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </p>
              <Badge className="bg-gray-200">
                <Badge className="bg-gray-100">100 USD</Badge> 500 rMETRIC
              </Badge>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Curve</p>
              <p className="text-xs text-gray-500">HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED</p>
              <div className="flex flex-row space-x-3 mt-1">
                <Badge>Aggresive</Badge>
                <p className="text-xs">
                  Rewards the top 10% of submissions for each challenge. Winners are determined through peer review
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Tokens</p>
              <p className="text-xs text-gray-500">TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE</p>
              <p className="flex flex-row space-x-3 mt-1">{/* <TokenBadge slug="Solana" /> */}</p>
            </Card>
          </div>
        </div>
      </main>
    </section>
  );
}
