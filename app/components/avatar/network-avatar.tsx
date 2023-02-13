import type { Network } from "@prisma/client";
import type { Props as AvatarProps } from "./avatar";
import { Avatar } from "./avatar";

type Props = { network: Pick<Network, "name"> } & AvatarProps;

export function NetworkAvatar({ network, ...avatarProps }: Props) {
  return (
    <Avatar
      {...avatarProps}
      src={`/img/icons/project-icons/${network.name.toLocaleLowerCase()}.svg`}
      alt={`${network.name} logo`}
      fallback={network.name.at(0)?.toUpperCase()}
    />
  );
}
