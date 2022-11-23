import type { Token } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";

type Props = { token: Token } & Avatar.AvatarProps;

export function TokenIcon({ token, ...props }: Props) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Image
        src={`/img/icons/token-icons/${token.symbol}.svg`}
        alt={`${token.name} logo`}
        className="h-6 w-6 object-contain"
      />
      <Avatar.Fallback className="h-6 w-6 px-1 flex items-center justify-center text-xs text-gray-100 bg-gray-400 rounded-full">
        {token.symbol.at(0)?.toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
