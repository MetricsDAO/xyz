import { useEffect, useState } from "react";
import { CaretUp32 } from "@carbon/icons-react";
import { usePrevious } from "~/utils/helpers";

import type { QuestionData } from "~/utils/types";

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
  selected: Record<string, string>;
  selectedProgram: Record<string, string>;
  networkMatchesWallet: boolean;
  buttonDisabled: boolean;
}) {
  let sorted: QuestionData[];
  const prevSelectedProgram = usePrevious(selectedProgram);
  const previousQuestions = usePrevious(questions);
  const prevSelected = usePrevious(selected);

  if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions || prevSelected !== selected) {
    if (selectedProgram.name === "All") {
      const property = selected.name === "Votes" ? "totalVotes" : "questionId";
      sorted = questions.sort((a: QuestionData, b: QuestionData) => {
        return a[property] < b[property] ? 1 : -1;
      });
    } else {
      //filter it
      sorted = questions.filter((obj: QuestionData) => {
        return obj.program == selectedProgram.name;
      });
    }
  } else {
    sorted = previousQuestions;
  }
  const [sortedQuestions, setSortedQuestions] = useState(sorted);

  useEffect(() => {
    if (selectedProgram !== prevSelectedProgram || previousQuestions !== questions) {
      setSortedQuestions(sorted);
    }
  }, [selectedProgram, prevSelectedProgram, sorted, previousQuestions, questions]);

  function render() {
    if (!sortedQuestions.length) {
      return <h1>No Questions to display</h1>;
    }
    return (
      <>
        {sortedQuestions.map((questionObj: QuestionData) => {
          return (
            <FilteredQuestions
              key={questionObj.questionId}
              initUpVoteQuestion={initUpVoteQuestion}
              question={questionObj}
              networkMatchesWallet={networkMatchesWallet}
              buttonDisabled={buttonDisabled}
            />
          );
        })}
      </>
    );
  }
  return render();
}

export function FilteredQuestions({
  question,
  initUpVoteQuestion,
  networkMatchesWallet,
  buttonDisabled,
}: {
  question: QuestionData;
  initUpVoteQuestion: (questionID: number) => {};
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
                initUpVoteQuestion(question.questionId);
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
