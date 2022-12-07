import { UserAvatarFilledAlt32 } from "@carbon/icons-react";
import { Link } from "@remix-run/react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { truncateAddress } from "~/utils/helpers";
import { Avatar } from "../../components/avatar";

/** Renders a wallet's avatar and address or ENS name, along with their rMETRIC balance, and UserCard on hover. */
export function UserBadge({ url, address, balance }: { url: string; address: `0x${string}`; balance: number }) {
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatarUrl } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  return (
    <Link to={url}>
      <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
        <div className="flex rounded-full bg-[#F1F3F5] px-1 gap-x-1 items-center py-1">
          {ensAvatarUrl ? <Avatar src={ensAvatarUrl} /> : <UserAvatarFilledAlt32 height={16} width={16} />}
          <p className="text-sm">{ensName ?? truncateAddress(address)}</p>
        </div>
        <p className="text-xs px-1">{balance} rMETRIC</p>
      </div>
    </Link>
  );
}
