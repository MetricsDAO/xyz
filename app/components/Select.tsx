import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { FieldProps } from "./Field";
import { FieldWrapper } from "./Field";
import { Field } from "./Field";

type Props = {
  name: string;
  placeholder?: string;
  options?: Option[];
} & FieldProps;

type Option = { value: string; label: React.ReactNode; prefix?: React.ReactNode };

export function Select({ options, placeholder, ...props }: Props) {
  const [value, setValue] = useControlField<string>(props.name);
  const selected = options?.find((o) => o.value === value);
  return (
    <Field {...props}>
      <Listbox value={value} onChange={setValue}>
        {({ open }) => (
          <>
            <input type="hidden" name={props.name} value={value} />
            <div className="relative mt-1">
              <FieldWrapper error={props.error}>
                <Listbox.Button className="input input-text">
                  <span className={clsx({ "text-gray-500": !selected }, "block truncate text-left")}>
                    {selected ? selected.label : placeholder}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Listbox.Button>
              </FieldWrapper>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options?.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        clsx(
                          active ? "text-white bg-sky-500" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={option.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>
                            {option.label}
                          </span>

                          {selected ? (
                            <span
                              className={clsx(
                                active ? "text-white" : "text-sky-500",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </Field>
  );
}

export function ValidatedSelect(props: Props) {
  const { error } = useField(props.name);
  return <Select {...props} error={error} />;
}
