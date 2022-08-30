import { RadioGroup } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";
import { sortMethods } from "~/utils/helpers";
import type { FCProps } from "~/utils/types";

export default function MyRadioGroup({
  setSelected,
  selected,
}: {
  setSelected: Dispatch<SetStateAction<Record<string, string>>>;
  selected: Record<string, string>;
}) {
  // const [selected, setSelected] = useState(sortMethods[0])

  return (
    <div className="tw-mx-auto tw-w-full tw-max-w-md tw-mb-8">
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="">Sort By</RadioGroup.Label>
        <div className="tw-space-y-2">
          {sortMethods.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
              value={plan}
              className={({ active, checked }) =>
                `${active ? "tw-ring-2 tw-ring-white tw-ring-opacity-60 tw-ring-offset-2 tw-ring-offset-sky-300" : ""}
                    ${checked ? "tw-bg-sky-900 tw-bg-opacity-75 tw-text-white" : "tw-bg-white"}
                      tw-relative tw-flex tw-cursor-pointer tw-rounded-lg tw-px-5 tw-py-4 tw-shadow-md tw-focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
                    <div className="tw-flex tw-items-center tw-pr-4">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`tw-font-medium  ${checked ? "tw-text-white" : "tw-text-gray-900"}`}
                        >
                          {plan.name}
                        </RadioGroup.Label>
                      </div>
                    </div>
                    {checked && (
                      <div className="tw-shrink-0 tw-text-white">
                        <CheckIcon className="tw-h-6 tw-w-6" />
                      </div>
                    )}
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

const CheckIcon: React.FC<FCProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
