import type { Dispatch } from "react";
import { protocols } from "~/utils/helpers";

export default function MultiSelect({
  setSelectedProgram,
  selectedProgram,
}: {
  setSelectedProgram: Dispatch<{ (prev: any): any }>;
  selectedProgram: { [key: string]: boolean };
}) {
  const handleCheckbox = (key: string) => {
    setSelectedProgram((prev) => ({ ...prev, [key]: !selectedProgram[key] }));
  };

  return (
    <div className="tw-mx-auto tw-w-full tw-max-w-md tw-pb-1">
      {protocols.map((plan) => (
        <div
          onChange={(checked) => handleCheckbox(plan.name)}
          className={` ${selectedProgram[plan.name] ? "tw-bg-[#f0f4fc] " : "tw-bg-white hover:tw-bg-[#f8f4f4]"}`}
          key={plan.name}
        >
          <label
            className={`tw-relative tw-w-full tw-flex tw-cursor-pointer tw-px-5 tw-py-2 tw-focus:outline-none
            ${selectedProgram[plan.name] ? "tw-text-[#2563EB]" : "tw-text-gray-900"}
            `}
          >
            {plan.name}
            <input
              type="checkbox"
              id={plan.name}
              value={plan.name}
              name={plan.name}
              className="tw-h-6 tw-w-6 tw-absolute tw-right-5"
            />
          </label>
        </div>
      ))}
    </div>
  );
}
