import type { Token } from "@prisma/client";
import { Badge } from "./Badge";

export function TokenBadge({ token, value }: { token: Token; value: number }) {
  return (
    <Badge>
      <img src={`/logos/${token.symbol}.svg`} alt={`${token.name} logo`} className="h-4 w-4" />
      <span className="mx-1">
        {value} {token.name}
      </span>
    </Badge>
  );
}
