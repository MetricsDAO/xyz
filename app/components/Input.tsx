import { useField } from "remix-validated-form";
import type { FieldProps } from "./Field";
import { FieldWrapper } from "./Field";
import { Field } from "./Field";

type InputProps = FieldProps & JSX.IntrinsicElements["input"];

/**
 * TextInput component that integrates with remix-validated-form.
 * Also so we can switch out the underlying component without affecting things higher up the tree.
 */
export function Input(props: InputProps) {
  return (
    <Field {...props}>
      <FieldWrapper error={props.error}>
        <input {...props} className="w-full h-12 outline-none px-3" />
      </FieldWrapper>
    </Field>
  );
}

/** Integration with remix-validated-form */
export function ValidatedInput(props: InputProps) {
  const { error } = useField(props.name);
  return <Input {...props} error={error} />;
}
