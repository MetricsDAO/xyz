import { CSVLink } from "react-csv";
import { filterSortCsvData } from "~/utils/helpers";
import type { QuestionData } from "~/utils/types";

export default function DownloadCSV({ questionData }: { questionData: QuestionData[] }) {
  return (
    <div className="tw-max-w-md tw-mx-auto tw-justify-center">
      <CSVLink data={filterSortCsvData(questionData)} filename={"question-data.csv"} target="_blank">
        <button className="tw-bg-[#212B36] tw-rounded-lg tw-mt-8 tw-py-3 tw-w-full tw-max-w-md tw-text-sm tw-text-white">
          Download CSV
        </button>
      </CSVLink>
    </div>
  );
}
