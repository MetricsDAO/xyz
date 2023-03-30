import { UserCircleIcon } from "@heroicons/react/20/solid";
import { BigNumber } from "ethers";
import { useContractRead, useEnsAvatar, useEnsName } from "wagmi";
import { useContracts } from "~/hooks/use-root-data";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import { displayBalance, truncateAddress } from "~/utils/helpers";
import { Avatar } from "../avatar";

/** Renders a wallet's avatar and address or ENS name, along with their rMETRIC balance, and UserCard on hover. */
export function UserBadge({ address, variant }: { address: `0x${string}`; variant?: "default" | "separate" }) {
  const contracts = useContracts();
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatarUrl } = useEnsAvatar({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const { data: reputationBalance } = useContractRead({
    address: contracts.ReputationToken.address,
    abi: contracts.ReputationToken.abi,
    functionName: "balanceOf",
    args: [address, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  if (variant === "separate") {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {ensAvatarUrl ? <Avatar src={ensAvatarUrl} size="sm" /> : <UserCircleIcon height={16} width={16} />}
        <p className="text-sm font-medium">{ensName ?? truncateAddress(address)}</p>
        <p className="text-xs py-1 px-1.5 bg-neutral-100 rounded-full text-stone-500">
          {reputationBalance ? displayBalance(reputationBalance) : "?"} rMETRIC
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
        <div className="flex rounded-full bg-[#F1F3F5] px-1 gap-x-1 items-center py-1">
          {ensAvatarUrl ? <Avatar src={ensAvatarUrl} /> : <UserCircleIcon height={16} width={16} />}
          <p className="text-sm">{ensName ?? truncateAddress(address)}</p>
        </div>
        <p className="text-xs px-1">{reputationBalance ? displayBalance(reputationBalance) : "?"} rMETRIC</p>
      </div>
    );
  }
}
