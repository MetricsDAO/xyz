import type { MultiSelectProps } from "@mantine/core";
import { MultiSelect as MMultiSelect } from "@mantine/core";
import { useControlField, useField } from "remix-validated-form";

interface Props extends MultiSelectProps {
  name: string;
}

/**
 * MultiSelect component that integrates with remix-validated-form.
 */
export function MultiSelect(props: Props) {
  const { error, validate } = useField(props.name);
  const [value, setValue] = useControlField<string[]>(props.name);
  return (
    <>
      {/* Repeating hidden inputs for an array. #UseThePlatform  */}
      {value?.map((v) => (
        <input key={v} type="hidden" name={props.name} value={v} />
      ))}
      <MMultiSelect
        error={error}
        value={value}
        onChange={(values) => {
          setValue(values);
          validate();
        }}
        {...props}
      />
    </>
  );
}
