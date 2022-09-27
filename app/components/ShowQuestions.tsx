import PaginatedItems from "./PaginatedItems";

import { PAGINATION_AMOUNT } from "~/utils/helpers";
import type { GetQuestionsByState, MetadataByQuestionId } from "~/hooks/useQuestionsWithMetadata";

export default function ShowQuestions({
  questions,
  ipfsDataByQuestionId,
  selected,
  selectedProgram,
}: {
  questions: GetQuestionsByState[];
  ipfsDataByQuestionId: MetadataByQuestionId;
  selected: string;
  selectedProgram: { [key: string]: boolean };
}) {
  // If no checkbox selected, show all questions
  const selectAll = !Object.keys(selectedProgram).find((key) => selectedProgram[key] === true);
  const property = selected === "Votes" ? "totalVotes" : "questionId";

  const filteredAndSorted: GetQuestionsByState[] = questions
    .filter((obj: GetQuestionsByState) => {
      if (selectAll) {
        return true;
      }
      const program = ipfsDataByQuestionId[obj.questionId.toNumber()].data?.program;
      if (program) {
        return selectedProgram[program];
      }
      return false;
    })
    .sort((a: GetQuestionsByState, b: GetQuestionsByState) => {
      return a[property].toNumber() < b[property].toNumber() ? 1 : -1;
    });

  if (!filteredAndSorted.length) {
    return <h1>No Questions to display</h1>;
  }
  return (
    <PaginatedItems
      questions={filteredAndSorted}
      ipfsDataByQuestionId={ipfsDataByQuestionId}
      itemsPerPage={PAGINATION_AMOUNT}
    />
  );
}
