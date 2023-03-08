import type { Token } from "database";
import type { Props as AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

type Props = { token: Pick<Token, "name" | "symbol"> } & AvatarProps;

export function TokenAvatar({ token, ...avatarProps }: Props) {
  return (
    <Avatar
      {...avatarProps}
      src={`/img/icons/token-icons/${token.symbol.toLowerCase()}.svg`}
      alt={`${token.name} logo`}
      fallback={token.symbol.at(0)?.toUpperCase()}
    />
  );
}
