import type { Token } from "@prisma/client";
import { Avatar } from "./avatar";

type Props = { token: Token };

export function TokenAvatar({ token }: Props) {
  return (
    <Avatar
      src={`/img/icons/token-icons/${token.symbol}.svg`}
      alt={`${token.name} logo`}
      fallback={token.symbol.at(0)?.toUpperCase()}
    />
  );
}
