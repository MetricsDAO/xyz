import { useField } from "remix-validated-form";
import { Field } from "./Field";
import { InputBase } from "./InputBase";
import type { FieldProps } from "./Field";
import type { InputBaseSize } from "./InputBase";

type InputProps = FieldProps & Omit<JSX.IntrinsicElements["input"], "size"> & { size?: InputBaseSize };

/**
 * TextInput component that integrates with remix-validated-form.
 * Also so we can switch out the underlying component without affecting things higher up the tree.
 */
export function Input({ size = "md", ...props }: InputProps) {
  return (
    <Field {...props}>
      <InputBase size={size} isError={Boolean(props.error)}>
        <input {...props} className="w-full h-12 outline-none px-3" />
      </InputBase>
    </Field>
  );
}

/** Integration with remix-validated-form */
export function ValidatedInput(props: InputProps) {
  const { error } = useField(props.name);
  return <Input {...props} error={error} />;
}
