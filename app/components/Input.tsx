import clsx from "clsx";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import type { FieldProps } from "./Field";
import { FieldWrapper } from "./Field";
import { Field } from "./Field";

type InputProps = { rightSection?: ReactNode } & FieldProps & JSX.IntrinsicElements["input"];

/**
 * TextInput component that integrates with remix-validated-form.
 * Also so we can switch out the underlying component without affecting things higher up the tree.
 */
export function Input({ rightSection, ...props }: InputProps) {
  return (
    <Field {...props}>
      <FieldWrapper error={props.error}>
        <div className="relative w-full">
          {rightSection && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">{rightSection}</div>
          )}
          <input
            {...props}
            className={clsx({ "pr-10": rightSection !== undefined }, "w-full h-12 outline-none px-3")}
          />
        </div>
      </FieldWrapper>
    </Field>
  );
}

/** Integration with remix-validated-form */
export function ValidatedInput(props: InputProps) {
  const { error } = useField(props.name);
  return <Input {...props} error={error} />;
}
