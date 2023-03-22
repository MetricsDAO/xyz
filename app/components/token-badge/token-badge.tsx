import type { Token } from "@prisma/client";
import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";
import { Badge } from "../badge";

export function TokenBadge({ token, quantity }: { token: Token; quantity?: string }) {
  return (
    <Badge>
      {quantity ? (
        <span className="text-xs mt-0.5"> {`${fromTokenAmount(quantity, token?.decimals ?? 18)} `} </span>
      ) : null}
      <span className="text-sm">{token.symbol}</span>
    </Badge>
  );
}

export function TokenBadgeByAddress({ address, quantity }: { address: string; quantity?: string }) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === address);
  if (!token) {
    return null;
  }
  return <TokenBadge token={token} quantity={quantity} />;
}
