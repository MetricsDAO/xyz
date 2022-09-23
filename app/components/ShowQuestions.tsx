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
  let sorted: QuestionData[];

  // If no checkbox selected, show all questions
  const selectAll = !Object.keys(selectedProgram).find((key) => selectedProgram[key] === true);

  const property = selected === "Votes" ? "totalVotes" : "questionId";
  if (selectAll) {
    sorted = questions.sort((a: QuestionData, b: QuestionData) => {
      return a[property] < b[property] ? 1 : -1;
    });
  } else {
    //filter then sort it
    sorted = questions
      .filter((obj: QuestionData) => {
        return selectedProgram[obj.program];
      })
      .sort((a: QuestionData, b: QuestionData) => {
        return a[property] < b[property] ? 1 : -1;
      });
  }

  function render() {
    if (!sorted.length) {
      return <h1>No Questions to display</h1>;
    }
    return <PaginatedItems questions={sorted} itemsPerPage={PAGINATION_AMOUNT} name={selected.name} />;
  }
  return render();
}
