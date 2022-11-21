import { UserAvatarFilledAlt32 } from "@carbon/icons-react";
import { Link } from "@remix-run/react";

/** Renders a wallet's avatar and address or ENS name, along with their rMETRIC balance, and UserCard on hover. */
export function UserBadge({ url, name, balance }: { url: string; name: string; balance: number }) {
  return (
    <Link to={url}>
      <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
        <div className="flex rounded-full bg-[#F1F3F5] px-1 gap-x-1 items-center py-1">
          <UserAvatarFilledAlt32 height={16} width={16} />
          <p className="text-sm">{name}</p>
        </div>
        <p className="text-xs px-1">{balance} rMETRIC</p>
      </div>
    </Link>
  );
}
