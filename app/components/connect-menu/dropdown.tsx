import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@remix-run/react";
import { useAccount, useContractRead, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { fetchBalance } from "@wagmi/core";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getUser } from "~/services/session.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { displayBalance, truncateAddress } from "~/utils/helpers";
import { ReputationToken } from "labor-markets-abi";
import { BigNumber } from "ethers";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import invariant from "tiny-invariant";
import { Button } from "../button";
import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { CopyToClipboard } from "../copy-to-clipboard";

export const ProfileMenu = () => {
  //   console.log("BALANCE", balance);

  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  console.log("ADDRESS", address);
  //   invariant(address, "Must be connected to view profile");

  const ensAvatar = useEnsAvatar({
    address: address,
    chainId: 1,
  });

  console.log("ENS AVATAR", ensAvatar.data);

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatarUrl } = useEnsAvatar({
    address: address,
    chainId: 1,
  });

  //TODO: get reputation balance and xmetric balance
  //   invariant(address, "Must be connected to view profile");

  //   const { data: reputationBalance } = useContractRead({
  //     address: ReputationToken.address,
  //     abi: ReputationToken.abi,
  //     functionName: "balanceOf",
  //     args: [address, BigNumber.from(REPUTATION_TOKEN_ID)],
  //   });

  return (
    <DropdownMenu.Portal className="mt-5 border-[1px]">
      <DropdownMenu.Content
        className="min-w-[328px] mt-5 mr-[24px] group-text-[14px] bg-white rounded-md p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        <DropdownMenu.Item className="flex rounded-md items-center cursor-pointer hover:bg-slate-100 outline-none px-[5px] py-2 relative">
          <Link className="flex items-center gap-x-2 text-sm" to="/app/profile">
            <img src="/img/profile-icon.svg" alt="" />
            <p>My Profile</p>
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-gray-300 m-[5px]" />
        <DropdownMenu.Item className="flex rounded-md items-center cursor-pointer hover:bg-slate-100 outline-none px-[5px] py-2 relative">
          <a
            className="flex items-center gap-x-2"
            target="_blank"
            href="https://discord.gg/p3GMjK2zAr"
            rel="noreferrer"
          >
            <img src="/img/discord-icon.svg" alt="" />
            <div className="text-sm">Join Discord Community</div>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-gray-300 m-[5px]" />
        <DropdownMenu.Item className="flex flex-col gap-2 hover:outline-none outline-none items-center py-2 align-middle">
          {ensAvatarUrl ? (
            <img src={ensAvatarUrl} className="rounded-full w-[64px]" alt="" />
          ) : (
            <div className="rounded-full">
              {address ? <Jazzicon diameter={64} seed={jsNumberForAddress(address)} /> : null}
            </div>
          )}
          {ensName ? ensName : truncateAddress(address?.toString() || "")}
          {/* //TODO: later we will show metric and xmetric balances */}
          {/* {balance ? ` (${balance})` : ""} */}
        </DropdownMenu.Item>
        <DropdownMenu.Item className="flex flex-row gap-2 justify-center hover:outline-none outline-none items-center py-2 align-middle">
          <CopyToClipboard
            className="text-stone-500 border-[1px] border-stone-500 rounded-md p-2"
            content={address as string}
            displayContent={truncateAddress(address?.toString() || "")}
            iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
          />
          <Button onClick={() => disconnect()} variant="danger">
            Disconnect
          </Button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};
