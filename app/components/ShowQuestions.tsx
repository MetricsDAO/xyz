import PaginatedItems from "./PaginatedItems";

import { PAGINATION_AMOUNT } from "~/utils/helpers";
import type { QuestionData } from "~/utils/types";

export default function ShowQuestions({
  questions,
  selected,
  selectedProgram,
}: {
  questions: QuestionData[];
  selected: string;
  selectedProgram: { [key: string]: boolean };
}) {
  // If no checkbox selected, show all questions
  const selectAll = !Object.keys(selectedProgram).find((key) => selectedProgram[key] === true);
  const property = selected === "Votes" ? "totalVotes" : "questionId";

  const filteredAndSorted: QuestionData[] = questions
    .filter((obj: QuestionData) => {
      if (selectAll) {
        return true;
      }
      if (obj.metadata.data?.program) {
        return selectedProgram[obj.metadata.data?.program];
      }
      return false;
    })
    .sort((a: QuestionData, b: QuestionData) => {
      return a[property] < b[property] ? 1 : -1;
    });

  if (!filteredAndSorted.length) {
    return <h1>No Questions to display</h1>;
  }
  return <PaginatedItems questions={filteredAndSorted} itemsPerPage={PAGINATION_AMOUNT} />;
}
