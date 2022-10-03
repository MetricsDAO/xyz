import type { QuestionData } from "~/utils/types";
import QuestionRow from "./QuestionRow";

export default function QuestionList({ questionData }: { questionData: QuestionData[] }) {
  return (
    <div className="tw-p-6  tw-space-y-2">
      {questionData.map((q) => {
        return <QuestionRow key={q.questionId} question={q} />;
      })}
    </div>
  );
}
