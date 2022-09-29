import { Disclosure, Transition } from "@headlessui/react";
import QuestionRowDisclosure from "./questionRow";

//currently hardcoded. Will Be Wired in with all the questions.
function QuestionList() {
  return (
    <div className="tw-bg-white tw-basis-1/2 tw-p-6 tw-rounded-lg tw-space-y-2">
      <QuestionRowDisclosure />
      <QuestionRowDisclosure />
      <QuestionRowDisclosure />
    </div>
  );
}

export default QuestionList;
