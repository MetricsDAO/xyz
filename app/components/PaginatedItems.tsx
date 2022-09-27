import { useEffect, useState } from "react";

import { CaretUp32 } from "@carbon/icons-react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import { useUpvoteQuestion } from "~/hooks/useUpvoteQuestion";
import type { GetQuestionsByState, MetadataByQuestionId, Metadata } from "~/hooks/useQuestionsWithMetadata";
export default function PaginatedItems({
  questions,
  ipfsDataByQuestionId,
  itemsPerPage,
}: {
  questions: GetQuestionsByState[];
  ipfsDataByQuestionId: MetadataByQuestionId;
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
      <Items currentItems={currentItems} ipfsDataByQuestionId={ipfsDataByQuestionId} />
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
  ipfsDataByQuestionId,
}: {
  currentItems: GetQuestionsByState[];
  ipfsDataByQuestionId: MetadataByQuestionId;
}) {
  return (
    <>
      {currentItems.map((questionObj: GetQuestionsByState) => {
        return (
          <FilteredQuestions
            key={questionObj.questionId.toNumber()}
            question={questionObj}
            metaData={ipfsDataByQuestionId[questionObj.questionId.toNumber()]}
          />
        );
      })}
    </>
  );
}

export function FilteredQuestions({ question, metaData }: { question: GetQuestionsByState; metaData?: Metadata }) {
  const { writeAsync, isLoading, isSuccess, error } = useUpvoteQuestion({ questionId: question.questionId.toNumber() });
  const isUpvoteDisabled = isLoading;

  useEffect(() => {
    if (isLoading) {
      toast.info(`Pending upvote for "${metaData?.data?.name}"`, { autoClose: false });
    } else if (isSuccess) {
      toast.success(`Successfully upvoted "${metaData?.data?.name}"`, { autoClose: false });
    } else if (error) {
      toast.error(`Error upvoting "${metaData?.data?.name}"`, { autoClose: false });
    }
  }, [isLoading, isSuccess, error, metaData?.data?.name]);

  let name = metaData?.data?.name;
  let program = metaData?.data?.program;
  let description = metaData?.data?.description;
  if (!metaData) {
    name = "Loading...";
    program = "";
    description = "Loading...";
  } else if (metaData.isError) {
    name = "Currently Unavailable";
  }

  return (
    <div
      data-question-id={question.questionId}
      className={`tw-flex tw-mb-10 ${!metaData || metaData.isError ? "tw-opacity-25" : "tw-opacity-100"}`}
    >
      <div
        data-id="post-votes"
        className="tw-self-start tw-mr-5 tw-border tw-rounded-md tw-w-10 tw-flex tw-flex-col tw-items-center"
      >
        {!metaData || metaData.isError ? (
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
        <span>{question.totalVotes.toNumber()}</span>
      </div>
      <div className="tw-flex tw-flex-col">
        <h4 className="tw-font-bold tw-text-xl"> {name}</h4>
        <p className="tw-text-sm tw-mb-4">{program}</p>
        <p className="tw-text-base tw-mb-4">{description}</p>
      </div>
    </div>
  );
}
