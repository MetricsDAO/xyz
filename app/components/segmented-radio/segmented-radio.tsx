import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useControlField } from "remix-validated-form";
import { useEffect } from "react";
import { usePrevious } from "react-use";

type Props = {
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
};

type Option = { value: string; label: React.ReactNode };

export function SegmentedRadio({ value, onChange, options, name }: Props) {
  return (
    <RadioGroup value={value} onChange={onChange} name={name}>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {options?.map((option) => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className={({ checked }) =>
              clsx(checked ? "bg-[#EDEDED]" : "bg-white", "border-2 rounded-md py-3 px-10 cursor-pointer")
            }
          >
            {option.label}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

export function ValidatedSegmentedRadio({ onChange, ...props }: Props & { name: string }) {
  const [value, setValue] = useControlField<string>(props.name);

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value);
  };

  const prevValue = usePrevious(value);
  useEffect(() => {
    if (onChange && prevValue !== value) {
      onChange(value);
    }
  }, [value, prevValue, onChange]);

  return <SegmentedRadio value={value} onChange={handleChange} {...props} />;
}
