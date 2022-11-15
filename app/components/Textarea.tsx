import { useField } from "remix-validated-form";
import type { FieldProps } from "./Field";
import { FieldWrapper } from "./Field";
import { Field } from "./Field";

type Props = FieldProps & JSX.IntrinsicElements["textarea"];

/**
 * Textarea component that integrates with remix-validated-form.
 */
export function Textarea({ name, error, label, ...props }: Props) {
  return (
    <Field name={name} error={error} label={label}>
      <FieldWrapper error={error}>
        <textarea name={name} {...props} className="w-full outline-none p-3" />
      </FieldWrapper>
    </Field>
  );
  // return <MTextarea {...props} error={field.error} />;
}

export function ValidatedTextarea(props: Props) {
  const { error } = useField(props.name);
  return <Textarea {...props} error={error} />;
}
