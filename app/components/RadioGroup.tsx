import { RadioGroup } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { sortMethods } from "~/utils/helpers";

export default function MyRadioGroup({
  setSelected,
  selected,
}: {
  setSelected: Dispatch<SetStateAction<string>>;
  selected: string;
}) {
  return (
    <div className="tw-mx-auto tw-w-full tw-max-w-md tw-pb-1">
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="tw-px-5 tw-py-2 tw-text-[#A3A3A3]">Sort By</RadioGroup.Label>
        <div>
          {sortMethods.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
              value={plan.name}
              className={`tw-relative tw-flex tw-cursor-pointer tw-px-5 tw-py-2 tw-focus:outline-none ${
                plan.name == selected ? "tw-bg-[#f0f4fc] " : "tw-bg-white hover:tw-bg-[#f8f4f4]"
              }`}
            >
              <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center tw-pr-4">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`tw-font-medium  ${plan.name == selected ? "tw-text-[#2563EB]" : "tw-text-gray-900"}`}
                    >
                      {plan.name}
                    </RadioGroup.Label>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id={plan.name}
                  value={plan.name}
                  name={plan.name}
                  checked={plan.name == selected}
                  className="tw-h-6 tw-w-6 tw-absolute tw-right-5 tw-cursor-pointer"
                />
              </div>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
