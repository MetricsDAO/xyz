import { useEffect, useState } from "react";
import { usePrevious } from "~/utils/helpers";

import PaginatedItems from "./PaginatedItems";

import type { QuestionData } from "~/utils/types";
import { PAGINATION_AMOUNT } from "~/utils/helpers";

export default function ShowQuestions({
  questions,
  initUpVoteQuestion,
  selected,
  selectedProgram,
  networkMatchesWallet,
  buttonDisabled,
}: {
  questions: QuestionData[];
  initUpVoteQuestion: (questionID: number) => {};
  selected: string;
  selectedProgram: { [key: string]: boolean };
  networkMatchesWallet: boolean;
  buttonDisabled: boolean;
}) {
  let sorted: QuestionData[];
  const prevSelectedProgram = usePrevious(selectedProgram);
  const previousQuestions = usePrevious(questions);
  const prevSelected = usePrevious(selected);

  // If no checkbox selected, show all questions
  const selectAll = !Object.keys(selectedProgram).find((key) => selectedProgram[key] === true);

  if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions || prevSelected !== selected) {
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
  } else {
    sorted = previousQuestions;
  }
  const [sortedQuestions, setSortedQuestions] = useState(sorted);

  useEffect(() => {
    if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions || prevSelected !== selected) {
      setSortedQuestions(sorted);
    }
  }, [selectedProgram, prevSelectedProgram, sorted, previousQuestions, questions, prevSelected, selected]);

  function render() {
    if (!sortedQuestions.length) {
      return <h1>No Questions to display</h1>;
    }
    return (
      <PaginatedItems
        questions={sortedQuestions}
        networkMatchesWallet={networkMatchesWallet}
        buttonDisabled={buttonDisabled}
        itemsPerPage={PAGINATION_AMOUNT}
        initUpVoteQuestion={initUpVoteQuestion}
        name={selected}
      />
    );
  }
  return render();
}
