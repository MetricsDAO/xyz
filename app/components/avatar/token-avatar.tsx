import type { Token } from "@prisma/client";
import type { Props as AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

type Props = { token: Pick<Token, "name" | "symbol"> } & AvatarProps;

// existing icon files. Avoid 404s.
const ICONS = ["algo", "axl", "eth", "flow", "near", "rune", "sol", "usdc"];

export function TokenAvatar({ token, ...avatarProps }: Props) {
  let src;
  if (ICONS.includes(token.symbol.toLowerCase())) {
    src = `/img/icons/project-icons/${token.symbol.toLowerCase()}.svg`;
  }

  return <Avatar {...avatarProps} src={src} alt={`${token.name} logo`} fallback={token.symbol.at(0)?.toUpperCase()} />;
}
