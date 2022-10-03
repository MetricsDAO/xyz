import { useState } from "react";
import { protocols, sortMethods } from "~/utils/helpers";
import MultiSelect from "./MultiSelect";
import RadioGroup from "./RadioGroup";

export function QuestionListControls() {
  const [selected, setSelected] = useState(sortMethods[0].name);
  const [selectedProgram, setSelectedProgram] = useState(
    protocols.reduce((acc, protocol) => {
      acc[protocol.name] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  return (
    <div className="tw-border tw-rounded-md tw-max-w-md tw-bg-white tw-mx-auto tw-justify-center">
      <RadioGroup setSelected={setSelected} selected={selected} />
      <hr className="solid tw-bg-[#A3A3A3]" />
      <MultiSelect setSelectedProgram={setSelectedProgram} selectedProgram={selectedProgram} />
    </div>
  );
}
