import { useField } from "remix-validated-form";
import { Field } from "./Field";
import { InputWrapper } from "./InputBase";
import type { FieldProps } from "./Field";
import type { InputBaseSize } from "./InputBase";
import React from "react";

// type InputProps = { prefix?: React.ReactNode; suffix?: React.ReactNode } & FieldProps &
//   Omit<JSX.IntrinsicElements["input"], "size"> & { size?: InputBaseSize };

type OwnProps = {
  label?: React.ReactNode;
  placeholder?: string;
  error?: React.ReactNode;
  size?: InputBaseSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

type NativeProps = Omit<React.InputHTMLAttributes<any>, keyof OwnProps>;

export type InputProps = OwnProps & NativeProps;

/**
 * TextInput component that integrates with remix-validated-form.
 * Also so we can switch out the underlying component without affecting things higher up the tree.
 */
export function Input({ name, label, iconLeft, error, iconRight, size = "md", ...props }: InputProps) {
  return (
    <Field name={name} label={label}>
      <InputWrapper size={size} isError={error !== undefined}>
        {iconLeft}
        <input {...props} className="w-full h-12 text-sm outline-none px-3 placeholder:text-gray-400" />
        {iconRight}
      </InputWrapper>
    </Field>
  );
}

/** Integration with remix-validated-form */
export function ValidatedInput(props: InputProps & { name: string }) {
  const { error } = useField(props.name);
  return <Input {...props} error={error} />;
}
