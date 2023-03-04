import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@remix-run/react";

export const ProfileMenu = () => {
  return (
    <DropdownMenu.Portal className="mt-5 border-[1px]">
      <DropdownMenu.Content
        className="min-w-[328px] mt-5 mr-[24px] group-text-[14px] bg-white rounded-md p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        <DropdownMenu.Item className="flex items-center cursor-pointer hover:bg-slate-100 outline-none px-[5px] gap-x-2 py-2 relative">
          <a href="https://discord.gg/p3GMjK2zAr">
            <img src="/img/profile-icon.svg" alt="" />
          </a>
          <Link to="/app/profile" className="text-sm">
            My Profile
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-gray-300 m-[5px]" />
        <DropdownMenu.Item className="flex items-center cursor-pointer hover:bg-slate-100 outline-none px-[5px] py-2 gap-x-2 relative">
          <a href="https://discord.gg/p3GMjK2zAr">
            <img src="/img/discord-icon.svg" alt="" />
          </a>
          <div className="text-sm">Join Discord Community</div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};
