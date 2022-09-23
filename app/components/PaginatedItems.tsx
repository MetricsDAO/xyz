import { useEffect, useState } from "react";

import { CaretUp32 } from "@carbon/icons-react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

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
  const { writeAsync, isLoading, isSuccess, error } = useUpvoteQuestion({ questionId: question.questionId });
  const isUpvoteDisabled = isLoading;

  useEffect(() => {
    if (isLoading) {
      toast.info(`Pending upvote for "${question.metadata.data?.name}"`, { autoClose: false });
    } else if (isSuccess) {
      toast.success(`Successfully upvoted "${question.metadata.data?.name}"`, { autoClose: false });
    } else if (error) {
      toast.error(`Error upvoting "${question.metadata.data?.name}"`, { autoClose: false });
    }
  }, [isLoading, isSuccess, error, question.metadata.data?.name]);

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
              onClick={async () => {
                if (isUpvoteDisabled) return false;
                await writeAsync?.();
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
