import { CSVLink } from "react-csv";
import MyRadioGroup from "~/components/RadioGroup";
import DropDown from "~/components/DropDownAllQuestions";
import { Download16 } from "@carbon/icons-react";
import { filterSortCsvData } from "~/utils/helpers";
import { QuestionData } from "~/utils/types";

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
    <div className="md:tw-w-[330px] tw-px-4">
      <MyRadioGroup setSelected={setSelected} selected={selected} />
      <DropDown setSelectedProgram={setSelectedProgram} selectedProgram={selectedProgram} />
      <CSVLink
        data={filterSortCsvData(questions)}
        className="blue-button tw-bg-[#21C5F2] tw-mt-8 tw-flex tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white"
        filename={"question-data.csv"}
        target="_blank"
      >
        <span className="tw-mr-3">Download CSV </span>
        <Download16 />
      </CSVLink>
    </div>
  );
}