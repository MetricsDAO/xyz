import { Combobox as HCombobox } from "@headlessui/react";
import { forwardRef, useEffect, useState } from "react";
import { useControlField, useField } from "remix-validated-form";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { usePrevious } from "react-use";

type Props = {
  multiple?: boolean;
  size?: "sm" | "md";
  options: Option[];
  placeholder?: string;
  value?: string[];
  onChange?: (values: string[]) => void;
};

type Option = { value: string; label: string; prefix?: React.ReactNode };

const buttonStyles = "w-full border border-gray-300 rounded-lg flex items-center overflow-auto bg-white";

const sizeStyles = {
  sm: "h-10",
  md: "h-12",
};

export const Combobox = forwardRef<HTMLDivElement, Props>(
  ({ size = "md", value, options, onChange, placeholder }, ref) => {
    const [query, setQuery] = useState("");

    const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
    const selected = value ? options.filter((o) => value.includes(o.value)) : [];

    const handleChange = (values: Option[]) => {
      onChange?.(values.map((v) => v.value));
    };

    return (
      <HCombobox as="div" value={selected} onChange={handleChange} multiple>
        <div className="relative" ref={ref}>
          <div className={clsx(buttonStyles, sizeStyles[size])}>
            {selected?.length > 0 && (
              <ul className="flex p-2 pr-0 flex-wrap">
                {selected.map((s) => (
                  <li
                    key={s.value}
                    className="bg-gray-200 m-1 rounded px-2 py-1 text-sm flex items-center whitespace-nowrap"
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
            <HCombobox.Button as="div" className="flex-1">
              <HCombobox.Input<"input", Option[]>
                onChange={(event) => setQuery(event.target.value)}
                placeholder={!selected ? placeholder : undefined}
                className="w-full outline-none px-3"
              />
            </HCombobox.Button>
            <HCombobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </HCombobox.Button>
          </div>

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
    );
  }
);

Combobox.displayName = "Combobox";

/** Combobox controlled by react-hook-form */
export function ControlledCombobox({ onChange, ...props }: Props & { name: string }) {
  const { getInputProps } = useField(props.name);
  const [value, setValue] = useControlField<string[]>(props.name);

  const handleChange = (value: string[]) => {
    setValue(value);
    onChange?.(value);
  };

  return <Combobox {...getInputProps(props)} value={value} onChange={handleChange} />;
}

export function ValidatedCombobox({ onChange, ...props }: Props & { name: string }) {
  const { getInputProps } = useField(props.name);
  const [value, setValue] = useControlField<string[]>(props.name);

  const handleChange = (value: string[]) => {
    setValue(value);
    onChange?.(value);
  };

  const prevValue = usePrevious(value);
  useEffect(() => {
    if (onChange && prevValue !== value) {
      onChange(value);
    }
  }, [value, prevValue, onChange]);

  return (
    <>
      <Combobox {...getInputProps(props)} value={value} onChange={handleChange} />
      {value ? value.map((v) => <input key={v} type="hidden" name={props.name} value={v} />) : null}
    </>
  );
}
