import PaginatedItems from "./PaginatedItems";

import { PAGINATION_AMOUNT } from "~/utils/helpers";
import type { QuestionData } from "~/utils/types";

export default function ShowQuestions({
  questions,
  selected,
  selectedProgram,
}: {
  questions: QuestionData[];
  selected: Record<string, string>;
  selectedProgram: Record<string, string>;
}) {
  let sorted: QuestionData[];

  const property = selected.name === "Votes" ? "totalVotes" : "questionId";
  if (selectedProgram.name === "All") {
    sorted = questions.sort((a: QuestionData, b: QuestionData) => {
      return a[property] < b[property] ? 1 : -1;
    });
  } else {
    //filter then sort it
    sorted = questions
      .filter((obj: QuestionData) => {
        return obj.program == selectedProgram.name;
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
