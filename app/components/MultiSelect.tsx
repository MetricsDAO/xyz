import { Checkbox32, CheckboxChecked32 } from "@carbon/icons-react";
import { RadioGroup } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { protocols, sortMethods } from "~/utils/helpers";

export default function MultiSelect({
  setSelected,
  selected,
}: {
  setSelected: Dispatch<SetStateAction<Record<string, string>>>;
  selected: Record<string, string>;
}) {

  return (
    <div className="tw-mx-auto tw-w-full tw-max-w-md tw-pb-1">
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="tw-px-5 tw-py-2 tw-text-[#A3A3A3]">Projects</RadioGroup.Label>
        <div>
          {protocols.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
              value={plan}
              className={`tw-bg-white tw-relative tw-flex tw-cursor-pointer tw-px-5 tw-py-2 tw-focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
                    <div className="tw-flex tw-items-center tw-pr-4">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`tw-font-medium  ${checked ? "tw-text-[#2563EB]" : "tw-text-gray-900" }`}
                        >
                          {plan.name}
                        </RadioGroup.Label>
                      </div>
                    </div>
                    {checked ? (
                      <div className="tw-shrink-0 tw-bg-[#2563EB] tw-text-white">
                        <CheckboxChecked32 className="tw-h-6 tw-w-6" />
                      </div>
                    ): (
                      <div className="tw-shrink-0 tw-text-[#E7E8E9]">
                        <Checkbox32 className="tw-h-6 tw-w-6" />
                      </div>
                    )
                    }
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}