import type { Token } from "@prisma/client";
import { Badge, TokenAvatar } from "~/components";
import type { LaborMarketDoc } from "~/domain";
import { fromTokenAmount } from "~/utils/helpers";

export function ChallengePoolBadges({
  pools,
  tokens,
}: {
  pools: LaborMarketDoc["serviceRequestRewardPools"];
  tokens: Token[];
}) {
  return (
    <>
      {pools.map((p) => {
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
    </>
  );
}
