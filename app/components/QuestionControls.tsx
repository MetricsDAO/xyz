import { CSVLink } from "react-csv";
import MyRadioGroup from "~/components/RadioGroup";
import DropDown from "~/components/DropDownAllQuestions";
import { Download16 } from "@carbon/icons-react";
import { filterSortCsvData } from "~/utils/helpers";
import { QuestionData } from "~/utils/types";
import CheckSelection from "./CheckSelection";
import MultiSelect from "./MultiSelect";

export default function QuestionControls({
  setSelected,
  selected,
  setSelectedProgram,
  selectedProgram,
  questions,
}: {
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selected: Record<string, string>;
  setSelectedProgram: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedProgram: Record<string, string>;
  questions: QuestionData[];
}) {
  return (
    <div className="md:tw-w-[330px] tw-border tw-rounded-md tw-bg-white">
      <MyRadioGroup setSelected={setSelected} selected={selected} />
      <hr className="solid tw-bg-[#A3A3A3]"/>
      <MultiSelect setSelected={setSelectedProgram} selected={selectedProgram}/>
    </div>
  );
}