import type { QuestionData } from "~/utils/types";
import { QuestionRow } from "./QuestionRow";

//currently hardcoded. Will Be Wired in with all the questions.
function QuestionList({ questionData }: { questionData: QuestionData[] }) {
  return (
    <div className="tw-bg-white tw-basis-1/2 tw-p-6 tw-rounded-lg tw-space-y-2">
      {questionData.map((q) => {
        return <QuestionRow key={q.questionId} question={q} />;
      })}
    </div>
  );
}

export default QuestionList;
