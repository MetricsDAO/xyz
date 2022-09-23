import { useState } from "react";

import ShowQuestions from "~/components/ShowQuestions";
import { protocols, sortMethods } from "~/utils/helpers";

import type { QuestionData } from "~/utils/types";
import QuestionControls from "./QuestionControls";

export default function AllQuestionsByState({ questions }: { questions: QuestionData[] }) {
  const [selected, setSelected] = useState(sortMethods[0].name);
  const [selectedProgram, setSelectedProgram] = useState(
    protocols.reduce((acc, protocol) => {
      acc[protocol.name] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // TODO: toast notifications hook
  return (
    <>
      {/* {alertContainerStatus && (
        <AlertBanner transactionStatus={writeTransactionStatus} setAlertContainerStatus={setAlertContainerStatus} />
      )} */}
      <div className="tw-flex tw-px-4 tw-flex-row justify-center tw-space-x-4">
        <div className="tw-block tw-border tw-p-2">
          <QuestionControls
            setSelected={setSelected}
            selected={selected}
            setSelectedProgram={setSelectedProgram}
            selectedProgram={selectedProgram}
          />
        </div>
        <div className="bg-white tw-basis-1/2 tw-p-6 tw-rounded-lg gap-2">
          <ShowQuestions selected={selected} selectedProgram={selectedProgram} questions={questions} />
        </div>
        <div className="tw-border tw-basis-1/4 tw-p-2">
          <h4 className="tw-font-bold tw-text-xl tw-p-2">Bounty question writing tips</h4>
          <div className="tw-p-5">
            <p className="tw-font-bold">Be specific</p>
            <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">tips</p>
          </div>
          <div className="tw-p-5">
            <p className="tw-font-bold">Examples of good writing</p>
            <p className="tw-text-sm tw-mb-4 tw-text-[#637381]">examples</p>
          </div>
        </div>
      </div>
    </>
  );
}
