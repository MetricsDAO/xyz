import type { Token } from "@prisma/client";
import type { Props as AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

type Props = { token: Token } & AvatarProps;

export function TokenAvatar({ token, ...avatarProps }: Props) {
  return (
    <Avatar
      {...avatarProps}
      src={`/img/icons/token-icons/${token.symbol}.svg`}
      alt={`${token.name} logo`}
      fallback={token.symbol.at(0)?.toUpperCase()}
    />
  );
}
