import { Combobox as HCombobox } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useControlField, useField } from "remix-validated-form";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import type { FieldProps } from "./Field";
import { Field } from "./Field";
import { FieldWrapper } from "./Field";

type Props = {
  name: string;
  label?: string;
  error?: string;
  multiple?: boolean;
  options: Option[];
  placeholder?: string;
  onChange?: (values: Option[]) => void;
} & FieldProps;

type Option = { value: string; label: string; prefix?: React.ReactNode };

export function Combobox({ label, error, options, name, onChange, placeholder }: Props) {
  const [selected, setSelected] = useControlField<Option[]>(name);

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Field name={name} label={label} error={error}>
      {selected?.map((s) => (
        <input key={s.value} type="hidden" name={name} value={s.value} />
      ))}

      <HCombobox as="div" value={selected ?? []} onChange={setSelected} multiple>
        <div className="relative">
          <FieldWrapper error={error}>
            {selected?.length > 0 && (
              <ul className="flex space-x-1 p-2 pr-0">
                {selected.map((s) => (
                  <li
                    key={s.value}
                    className="bg-gray-200 rounded px-2 py-1 text-sm flex items-center whitespace-nowrap"
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
            <HCombobox.Input<"input", Option[]>
              onChange={(event) => setQuery(event.target.value)}
              placeholder={!selected ? placeholder : undefined}
              className="h-12 flex-1 outline-none px-3"
            />
            <HCombobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </HCombobox.Button>
          </FieldWrapper>

          {filteredOptions.length > 0 && (
            <HCombobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <HCombobox.Option
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span className={clsx("block truncate", selected && "font-semibold")}>{option.label}</span>

                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </HCombobox.Option>
              ))}
            </HCombobox.Options>
          )}
        </div>
      </HCombobox>
    </Field>
  );
}

export function ValidatedCombobox(props: Props) {
  const { error } = useField(props.name);
  return <Combobox {...props} error={error} />;
}
