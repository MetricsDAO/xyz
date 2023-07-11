import type { Token } from "@prisma/client";
import { Badge } from "~/components";
import { RewardBadge } from "~/components/reward-badge";
import type { LaborMarketDoc } from "~/domain/labor-market/schemas";
import { fromTokenAmount } from "~/utils/helpers";

const MAX = 3;

export function ChallengePoolBadges({
  pools,
  tokens,
}: {
  pools: LaborMarketDoc["indexData"]["serviceRequestRewardPools"];
  tokens: Token[];
}) {
  const surplus = pools.length - MAX;
  return (
    <div className="flex flex-wrap gap-2">
      {pools.slice(0, MAX).map((p) => {
        const token = tokens.find((t) => t.contractAddress === p.pToken);
        if (token) {
          return (
            <RewardBadge
              key={token?.id}
              payment={{ amount: fromTokenAmount(p.pTokenQuantity, token.decimals), token }}
            />
          );
        }
        return null;
      })}
      {surplus > 0 && (
        <div className="flex flex-wrap gap-2 group">
          <div className="hidden group-hover:flex flex-wrap gap-2">
            {pools.slice(MAX).map((p) => {
              const token = tokens.find((t) => t.contractAddress === p.pToken);
              if (token) {
                return (
                  <RewardBadge
                    key={token?.id}
                    payment={{ amount: fromTokenAmount(p.pTokenQuantity, token.decimals), token }}
                  />
                );
              }
              return null;
            })}
          </div>
          <Badge className="block group-hover:hidden">{`${surplus}+`}</Badge>
        </div>
      )}
    </div>
  );
}
