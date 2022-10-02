import { faAngleDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import type { QuestionData } from "~/utils/types";

export default function QuestionRow({ question }: { question: QuestionData }) {
  const date = new Date(question.date).toDateString();
  return (
    <div className="tw-bg-[#FAFAFA] tw-border-[#E6E6E6] tw-border-[1px] tw-space-y-6 tw-basis-1/2 tw-p-6 tw-rounded-lg gap-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="tw-flex tw-w-full tw-items-center tw-space-x-4">
              <UpvoteBoxClickedState question={question} />
              <div className="tw-grid tw-space-y-1 tw-justify-items-start tw-w-full">
                <div className="tw-text-[#252525] tw-font-inter tw-text-left tw-text-[26px]">{question.name}</div>
                <div className="tw-flex tw-flex-row tw-space-x-1 tw-items-center tw-text-left tw-font-inter tw-text-[12px]">
                  <div className="tw-text-[#637381]">Wallet Address </div>
                  <div className="tw-text-[#919EAB]">{`${"Submitted On"} ${date} | ${question.program} `}</div>
                </div>
              </div>
              <FontAwesomeIcon
                className={`${open ? "tw-rotate-180 tw-transform" : ""} tw-justify-end`}
                icon={faAngleDown}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel static className="text-gray-500 bg-[#FAFAFA]">
                <span className="tw-font-inter tw-font-500 tw-text-[16px]"> Subtitle Here </span>
                <span className="tw-font-inter tw-font-500 tw-text-[16px]">
                  <br />
                  <br />
                  {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum. */}
                  {question.description}
                </span>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}

function UpvoteBox({ question }: { question: QuestionData }) {
  return (
    <div className="tw-flex tw-bg-[#DFE3E8] tw-text-sm tw-border-[.4px] tw-h-[40px] tw-rounded tw-w-[40px] tw-items-center tw-space-x-1 tw-place-content-center">
      <FontAwesomeIcon className="tw-h-3" icon={faArrowUp} />
      <span> {question?.totalVotes ? question.totalVotes : 0}</span>
    </div>
  );
}

function UpvoteBoxClickedState({ question }: { question: QuestionData }) {
  return (
    <div className="tw-flex tw-bg-[#1A1919] tw-text-sm tw-border-[.4px] tw-h-[40px] tw-rounded tw-w-[40px] tw-items-center tw-space-x-1 tw-place-content-center tw-text-gradient-to-r tw-from-indigo-500 tw-to-pink-500">
      <FontAwesomeIcon style={{ color: "#00C2FF", height: "12px" }} icon={faArrowUp} />
      <span className="tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-[#00C2FF] tw-to-[#FFD991]">
        {question?.totalVotes ? question.totalVotes : 0}
      </span>
    </div>
  );
}
