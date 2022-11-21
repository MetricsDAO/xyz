import type { Token } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";
import { Badge } from "./Badge";

export function TokenBadge({ token, value }: { token: Token; value: number }) {
  return (
    <Badge>
      <Avatar.Root className="h-4 w-4">
        <Avatar.Image src={`/logos/${token.symbol}.svg`} alt={`${token.name} logo`} />
        <Avatar.Fallback>{token.symbol.at(0)}</Avatar.Fallback>
      </Avatar.Root>
      <span className="mx-1">
        {value} {token.name}
      </span>
    </Badge>
  );
}
