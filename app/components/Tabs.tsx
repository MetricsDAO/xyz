/* eslint-disable react/display-name */
import { Tab as HTab } from "@headlessui/react";
import { Fragment } from "react";

export const Tabs = ({ children }: { children: React.ReactNode }) => {
  return <HTab.Group>{children}</HTab.Group>;
};

Tabs.Tab = ({ children }: { children: React.ReactNode }) => {
  return (
    <HTab as={Fragment}>
      {({ selected }) => (
        <button
          className={
            selected
              ? "border-b-2 border-[#16ABDD] text-[#16ABDD] outline-none hover:bg-[#F6F6F6] px-2 py-1 rounded-t-md"
              : "outline-none border-none hover:bg-[#F6F6F6] px-2 py-1 rounded-t-md"
          }
        >
          {children}
        </button>
      )}
    </HTab>
  );
};

Tabs.List = ({ children }: { children: React.ReactNode }) => {
  return (
    <HTab.List className="flex flex-row space-x-4 border-b border-[#EDEDED] mb-5 text-[#666666] text-[14px]">
      {children}
    </HTab.List>
  );
};

Tabs.Panels = HTab.Panels;

Tabs.Panel = HTab.Panel;
