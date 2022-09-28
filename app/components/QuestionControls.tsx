import MyRadioGroup from "~/components/RadioGroup";
import MultiSelect from "./MultiSelect";
import type { Dispatch, SetStateAction } from "react";

export default function QuestionControls({
  setSelected,
  selected,
  setSelectedProgram,
  selectedProgram,
}: {
  setSelected: Dispatch<SetStateAction<string>>;
  selected: string;
  setSelectedProgram: React.Dispatch<{ (prev: any): any }>;
  selectedProgram: { [key: string]: boolean };
}) {
  return (
    <div className="md:tw-w-[330px] tw-border tw-rounded-md tw-bg-white tw-mt-3 tw-mx-auto tw-justify-center">
      <MyRadioGroup setSelected={setSelected} selected={selected} />
      <hr className="solid tw-bg-[#A3A3A3]" />
      <MultiSelect setSelectedProgram={setSelectedProgram} selectedProgram={selectedProgram} />
    </div>
  );
}
