import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { FieldProps } from "./Field";
import { Field } from "./Field";
import type { InputBaseSize } from "./InputBase";
import { InputBase } from "./InputBase";

type Props = {
  name: string;
  options?: Option[];
  size?: InputBaseSize;
} & FieldProps;

type Option = { value: string; label: React.ReactNode; prefix?: React.ReactNode };

type ControlledSelectProps = Props & {
  value: string | undefined;
  setValue: (value: string) => void;
};

/** A Select component that's controlled from parent state. */
export function ControlledSelect({ options, value, setValue, size = "md", ...props }: ControlledSelectProps) {
  const selected = options?.find((o) => o.value === value);
  return (
    <Field {...props}>
      <Listbox value={value} onChange={setValue}>
        {({ open }) => (
          <>
            <input type="hidden" name={props.name} value={value} />
            <div className="relative mt-1">
              <InputBase size={size} isError={Boolean(props.error)}>
                <Listbox.Button className={clsx("flex-1 px-3", { "h-10": size === "sm", "h-12": size === "md" })}>
                  <span className={clsx("block truncate text-left", { "text-sm": size === "sm" })}>
                    {selected?.label}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Listbox.Button>
              </InputBase>

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

/** A Select component that's controlled from remix-validated-form. */
export function ValidatedSelect(props: Props) {
  const { error } = useField(props.name);
  const [value, setValue] = useControlField<string>(props.name);
  return <ControlledSelect {...props} error={error} value={value} setValue={setValue} />;
}

/** Select comopnent that controls itself. */
export function Select({ options, ...props }: Props) {
  const [value, setValue] = useState<string>();
  return (
    <>
      <input type="hidden" name={props.name} value={value} />
      <ControlledSelect value={value} setValue={setValue} {...props} options={options} />
    </>
  );
}
