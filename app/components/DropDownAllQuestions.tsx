import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckmarkFilled32, CaretDown32 } from "@carbon/icons-react";
import { protocols } from "~/utils/helpers";

export default function DropDown({
  selectedProgram,
  setSelectedProgram,
}: {
  selectedProgram: any;
  setSelectedProgram: any;
}) {
  return (
    <>
      <h1>Filter By:</h1>
      <Listbox
        data-id="program-type"
        value={selectedProgram}
        onChange={setSelectedProgram}
      >
        <div className="tw-relative tw-mt-1">
          <Listbox.Button className="tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-shadow-md tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white tw-focus-visible:ring-opacity-75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
            <span className="tw-block tw-truncate">{selectedProgram.name}</span>
            <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
              <CaretDown32
                className="tw-h-5 tw-w-5 tw-text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-sm:text-sm">
              {protocols.map((protocol, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4 ${
                      active
                        ? "tw-bg-amber-100 tw-text-amber-900"
                        : "tw-text-gray-900"
                    }`
                  }
                  value={protocol}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`tw-block tw-truncate ${
                          selected ? "tw-font-medium" : "tw-font-normal"
                        }`}
                      >
                        {protocol.name}
                      </span>
                      {selected ? (
                        <span className="tw-absolute tw-items-center tw-inset-y-0 tw-left-0 tw-flex tw-tems-center tw-pl-3 tw-text-amber-600">
                          <CheckmarkFilled32
                            className="tw-h-5 tw-w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
}
