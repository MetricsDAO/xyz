import { CSVLink } from "react-csv";
import { filterSortCsvData } from "~/utils/helpers";
import type { QuestionData } from "~/utils/types";

export default function WritingTips({ questionArray }: { questionArray?: QuestionData[] }) {
  return (
    <div className="tw-mt-9 tw-mx-2">
      <button className="tw-bg-[#212B36] tw-text-white tw-rounded-lg tw-w-full tw-max-w-md tw-py-3 tw-text-sm">
        {" "}
        + Create question{" "}
      </button>
      <h4 className="tw-font-bold tw-text-xl tw-p-2 tw-mt-3">Bounty question writing tips</h4>
      <div className="tw-px-5 tw-mt-2">
        <p className="tw-font-bold">Be specific</p>
        <p className="tw-text-sm tw-mb-2 tw-text-[#637381]">
          TL;DR tips: <br />
          Don’t ever assume that someone will “know what you mean” <br />
          Be specific <br />
          Define metrics <br />
          Specify time boundaries
        </p>
      </div>
      <div className="tw-px-5 tw-mt-4">
        <p className="tw-font-bold">Examples of good writing</p>
        <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">
          ORIGINAL Version: How many people actively use Sushi? <br />
          Be specific. <br />
          <br />
          Original question has many interpretations: SUSHI the token? SUSHI the DEX? What is a person? Are we talking
          Ethereum? What about Polygon? <br />
          <br />
          UPDATED Version: How many addresses actively use the SUSHI token on Ethereum?
        </p>
      </div>
      <div className="tw-pl-5 tw-mt-8">
        {questionArray ? (
          <CSVLink
            data={filterSortCsvData(questionArray)}
            className="tw-bg-[#212B36] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white"
            filename={"question-data.csv"}
            target="_blank"
          >
            <span>Download CSV</span>
          </CSVLink>
        ) : (
          <p />
        )}
      </div>
    </div>
  );
}
