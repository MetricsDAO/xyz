import { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";
import { CaretUp32 } from "@carbon/icons-react";

import type { QuestionData } from "~/utils/types";
export default function PaginatedItems({
  questions,
  setQuestionIdToVote,
  networkMatchesWallet,
  buttonDisabled,
  itemsPerPage,
  name,
}: {
  questions: QuestionData[];
  setQuestionIdToVote: (questionID: number) => {};
  networkMatchesWallet: boolean;
  buttonDisabled: boolean;
  itemsPerPage: number;
  name: string;
}) {
  const [currentItems, setCurrentItems] = useState<any>(null);
  const [pageCount, setPageCount] = useState<any>(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(questions.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(questions.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, questions, name]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % questions.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items
        currentItems={currentItems}
        setQuestionIdToVote={setQuestionIdToVote}
        networkMatchesWallet={networkMatchesWallet}
        buttonDisabled={buttonDisabled}
      />
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

function Items({
  currentItems,
  setQuestionIdToVote,
  networkMatchesWallet,
  buttonDisabled,
}: {
  currentItems: QuestionData[];
  setQuestionIdToVote: (questionID: number) => {};
  networkMatchesWallet: boolean;
  buttonDisabled: boolean;
}) {
  return (
    <>
      {currentItems &&
        currentItems.map((questionObj: QuestionData) => {
          return (
            <FilteredQuestions
              key={questionObj.questionId}
              setQuestionIdToVote={setQuestionIdToVote}
              question={questionObj}
              networkMatchesWallet={networkMatchesWallet}
              buttonDisabled={buttonDisabled}
            />
          );
        })}
    </>
  );
}

export function FilteredQuestions({
  question,
  setQuestionIdToVote,
  networkMatchesWallet,
  buttonDisabled,
}: {
  question: QuestionData;
  setQuestionIdToVote: (questionID: number) => {};
  networkMatchesWallet: boolean;
  buttonDisabled: boolean;
}) {
  return (
    <div
      data-question-id={question.questionId}
      className={`tw-flex tw-mb-10 ${question.loading ? "tw-opacity-25" : "tw-opacity-100"}`}
    >
      <div
        data-id="post-votes"
        className="tw-self-start tw-mr-5 tw-border tw-rounded-md tw-w-10 tw-flex tw-flex-col tw-items-center"
      >
        {question.unavailable || question.loading || !networkMatchesWallet ? (
          <>
            <span className="tw-opacity-25">N/A</span>
            <span className="tw-opacity-25">{question.totalVotes}</span>
          </>
        ) : (
          <>
            <CaretUp32
              className={`${buttonDisabled ? "tw-cursor-default tw-opacity-25 " : "tw-cursor-pointer tw-opacity-100"}`}
              onClick={() => {
                if (buttonDisabled) return false;
                setQuestionIdToVote(question.questionId);
              }}
            />
            <span>{question.totalVotes}</span>
          </>
        )}
      </div>
      <div className="tw-flex tw-flex-col">
        <h4 className="tw-font-bold tw-text-xl"> {question.name}</h4>
        <p className="tw-text-sm tw-mb-4">{question.program}</p>
        <p className="tw-text-base tw-mb-4">{question.description}</p>
      </div>
    </div>
  );
}
