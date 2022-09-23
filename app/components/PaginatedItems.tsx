import { useState } from "react";

import { CaretUp32 } from "@carbon/icons-react";
import ReactPaginate from "react-paginate";

import { useUpvoteQuestion } from "~/hooks/questions";
import type { QuestionData } from "~/utils/types";
export default function PaginatedItems({
  questions,
  itemsPerPage,
}: {
  questions: QuestionData[];
  itemsPerPage: number;
}) {
  const [itemOffset, setItemOffset] = useState(0);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % questions.length;
    setItemOffset(newOffset);
  };

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = questions.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(questions.length / itemsPerPage);

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        containerClassName="pagination"
      />
    </>
  );
}

function Items({ currentItems }: { currentItems: QuestionData[] }) {
  return (
    <>
      {currentItems.map((questionObj: QuestionData) => {
        return <FilteredQuestions key={questionObj.questionId} question={questionObj} />;
      })}
    </>
  );
}

export function FilteredQuestions({ question }: { question: QuestionData }) {
  const { writeAsync, isLoading } = useUpvoteQuestion({ questionId: question.questionId });
  const isUpvoteDisabled = isLoading;

  let name = question.metadata.data?.name;
  let program = question.metadata.data?.program;
  let description = question.metadata.data?.description;
  if (question.metadata.isLoading) {
    name = "Loading...";
    program = "";
    description = "Loading...";
  } else if (question.metadata.isError) {
    name = "Currently Unavailable";
  }

  return (
    <div
      data-question-id={question.questionId}
      className={`tw-flex tw-mb-10 ${
        question.metadata.isLoading || question.metadata.isError ? "tw-opacity-25" : "tw-opacity-100"
      }`}
    >
      <div
        data-id="post-votes"
        className="tw-self-start tw-mr-5 tw-border tw-rounded-md tw-w-10 tw-flex tw-flex-col tw-items-center"
      >
        {question.metadata.isLoading || question.metadata.isError ? (
          <>
            <span>N/A</span>
          </>
        ) : (
          <>
            <CaretUp32
              className={`${
                isUpvoteDisabled ? "tw-cursor-default tw-opacity-25 " : "tw-cursor-pointer tw-opacity-100"
              }`}
              onClick={() => {
                if (isUpvoteDisabled) return false;
                writeAsync?.();
              }}
            />
          </>
        )}
        <span>{question.totalVotes}</span>
      </div>
      <div className="tw-flex tw-flex-col">
        <h4 className="tw-font-bold tw-text-xl"> {name}</h4>
        <p className="tw-text-sm tw-mb-4">{program}</p>
        <p className="tw-text-base tw-mb-4">{description}</p>
      </div>
    </div>
  );
}
