import { ChevronDown32 } from "@carbon/icons-react";
import { Fragment, useState } from "react";
import { protocols, truncateAddress } from "~/utils/helpers";

import { Listbox, Transition } from "@headlessui/react";

export function CreateQuestion({ address }: { address: string }) {
  const [selectedProgram, setSelectedProgram] = useState(protocols[0]);
  return (
    <>
      <div className="tw-flex tw-flex-row">
        <p className="tw-text-left tw-mb-3 tw-text-black tw-text-3xl tw-font-bold tw-pr-5">Create question</p>
        <span className="tw-text-sm tw-text-[#637381] tw-mt-3 tw-ml-auto">{truncateAddress(address)}</span>
      </div>
      <div className="tw-mb-4">
        <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-title">
          Question Title:
        </label>
        <input
          className="tw-block tw-w-full tw-appearance-none tw-border tw-rounded tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
          id="question-title"
          type="text"
          placeholder="Title name"
        />
      </div>
      <div className="tw-mb-4">
        <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="program-type">
          Project:
        </label>
        <div>
          <Listbox data-id="program-type" value={selectedProgram} onChange={setSelectedProgram}>
            <div className="tw-relative tw-mt-1">
              <Listbox.Button className="tw-relative tw-w-full tw-border tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                <span className="tw-block tw-truncate">{selectedProgram.name}</span>
                <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                  <ChevronDown32 className="tw-h-5 tw-w-5 tw-text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-sm:text-sm">
                  {protocols.map((protocol, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                          active ? "tw-bg-[#f0f4fc] tw-text-[#2563EB]" : "tw-text-gray-900"
                        }`
                      }
                      value={protocol}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`tw-block tw-truncate ${selected ? "tw-font-medium" : "tw-font-normal"}`}>
                            {protocol.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="tw-mb-4">
        <label className="tw-block tw-text-[#2C2E30] tw-text-sm tw-font-bold tw-mb-2" htmlFor="question-body">
          Question:
        </label>
        <textarea
          rows={4}
          className="tw-block tw-appearance-none tw-border tw-resize-none tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight tw-focus:outline-none tw-focus:shadow-outline"
          id="question-body"
          placeholder="Type to get started"
        />
      </div>
      <p className="tw-text-[#A0A3A6] tw-text-sm tw-mb-10">
        Remember to be specific with your question. Never assume that someone will “Know what you mean.” Be specific,
        Define metrics, specifiy time boundaries.
      </p>
      <div className="tw-mb-12">
        <button
          disabled={!address}
          //   onClick={ipfsUpload}
          className="tw-bg-black tw-w-full tw-py-3 tw-text-sm tw-rounded-lg tw-text-white disabled:opacity-25"
        >
          Submit
        </button>
      </div>
    </>
  );
}
