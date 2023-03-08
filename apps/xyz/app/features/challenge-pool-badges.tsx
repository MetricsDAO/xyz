import type { Token } from "database";
import { Badge, TokenAvatar } from "~/components";
import type { LaborMarketDoc } from "~/domain";
import { fromTokenAmount } from "~/utils/helpers";

const MAX = 3;

export function ChallengePoolBadges({
  pools,
  tokens,
}: {
  pools: LaborMarketDoc["serviceRequestRewardPools"];
  tokens: Token[];
}) {
  const surplus = pools.length - MAX;
  return (
    <div className="flex flex-wrap gap-2">
      {pools.slice(0, MAX).map((p) => {
        const token = tokens.find((t) => t.contractAddress === p.pToken);
        if (token) {
          return (
            <Badge key={token?.id}>
              <TokenAvatar token={token} />
              <span className="mx-1">
                {fromTokenAmount(p.pTokenQuantity)} {token.symbol}
              </span>
            </Badge>
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
                  <Badge key={token?.id}>
                    <TokenAvatar token={token} />
                    <span className="mx-1">
                      {fromTokenAmount(p.pTokenQuantity)} {token.symbol}
                    </span>
                  </Badge>
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
