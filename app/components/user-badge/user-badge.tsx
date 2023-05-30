import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useEnsAvatar, useEnsName } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { truncateAddress } from "~/utils/helpers";
import { Avatar } from "../avatar";

/** Renders a wallet's avatar and address or ENS name, along with their rMETRIC balance, and UserCard on hover. */
export function UserBadge({ address, variant }: { address: EvmAddress; variant?: "default" | "separate" }) {
  // const contracts = useContracts();
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatarUrl } = useEnsAvatar({ address, chainId: 1 });

  if (variant === "separate") {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {ensAvatarUrl ? <Avatar src={ensAvatarUrl} size="sm" /> : <UserCircleIcon height={16} width={16} />}
        <p className="text-sm font-medium">{ensName ?? truncateAddress(address)}</p>
      </div>
    );
  } else {
    return (
      <div className="flex rounded-full bg-[#F1F3F5] px-2 gap-x-1 items-center py-1">
        {ensAvatarUrl ? <Avatar src={ensAvatarUrl} /> : <UserCircleIcon height={16} width={16} />}
        <p className="text-sm">{ensName ?? truncateAddress(address)}</p>
      </div>
    );
  }
}
