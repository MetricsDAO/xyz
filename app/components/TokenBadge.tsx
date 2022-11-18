import type { Token } from "@prisma/client";
import { Badge } from "./Badge";

export function TokenBadge({ token }: { token: Token }) {
  return (
    <Badge>
      <img src={`/logos/${token.symbol}.svg`} alt={`${token.name} logo`} className="h-4 w-4" />
      <span className="mx-1">{token.name}</span>
    </Badge>
  );
}
