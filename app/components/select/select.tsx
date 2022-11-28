import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useEffect } from "react";
import { usePrevious } from "react-use";
import { useControlField } from "remix-validated-form";

type Props = {
  name?: string;
  size?: "sm" | "md";
  options: Option[];
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

type Option = {
  value: string;
  label: string;
};

const buttonStyles = "w-full border border-gray-300 rounded-lg flex items-center overflow-hidden";

const sizeStyles = {
  sm: "h-10",
  md: "h-12",
};

/** Controlled select input with support for multiple values. */
export function Select({ label, size = "md", value, onChange, options, placeholder }: Props) {
  const selected = options.find((option) => option.value === value);
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className={clsx(buttonStyles, sizeStyles[size])}>
            <span className="flex-1 outline-none px-3 text-left text-sm block truncate">
              {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            <span className="pointer-events-none px-2">
              <ChevronDownIcon className="h-3 w-3 text-gray-600" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="-translate-y-2 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-out duration-200"
            leaveFrom="translate-y-0 opaciry-100"
            leaveTo="-translate-y-2 opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white border border-gray-200 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  className={({ active }) =>
                    clsx("cursor-default relative py-3 px-5 text-sm", { "bg-gray-100": active })
                  }
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}

export function ValidatedSelect({ onChange, ...props }: Props & { name: string }) {
  const [value, setValue] = useControlField<string>(props.name);

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value);
  };

  const prevValue = usePrevious(value);
  useEffect(() => {
    if (prevValue !== value) {
      onChange?.(value);
      console.log(value);
    }
  }, [value, prevValue, onChange]);

  return (
    <>
      <Select {...props} value={value} onChange={handleChange} />
      {value ? <input type="hidden" name={props.name} value={value} /> : null}
    </>
  );
}
