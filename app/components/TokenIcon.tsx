import type { Token } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";

export function TokenIcon({ token }: { token: Token }) {
  return (
    <Avatar.Root className="h-4 w-4">
      <Avatar.Image src={`/img/icons/token-icons/${token.symbol}.svg`} alt={`${token.name} logo`} />
      <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs text-gray-100 bg-gray-400 rounded-full">
        {token.symbol.at(0)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
