import { Tab } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  tabs: string[];
  panels: React.ReactNode[];
};

export function Tabs({ tabs, panels }: Props) {
  return (
    <Tab.Group>
      <Tab.List className="flex flex-row space-x-4 border-b border-[#EDEDED] mb-5 text-[#666666] text-[14px]">
        {tabs.map((tab, index) => (
          <Tab as={Fragment} key={tab}>
            {({ selected }) => (
              <button
                className={
                  selected
                    ? "border-b-2 border-[#16ABDD] outline-none hover:bg-[#F6F6F6] px-2 py-1 rounded-t-md"
                    : "outline-none border-none hover:bg-[#F6F6F6] px-2 py-1 rounded-t-md"
                }
              >
                {tab}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {panels.map((panel, index) => (
          <Tab.Panel key={index}>{panel}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
