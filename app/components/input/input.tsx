import { useField } from "remix-validated-form";
import type { InputBaseSize } from "../InputBase";
import React from "react";
import clsx from "clsx";

// type InputProps = { prefix?: React.ReactNode; suffix?: React.ReactNode } & FieldProps &
//   Omit<JSX.IntrinsicElements["input"], "size"> & { size?: InputBaseSize };

type OwnProps = {
  label?: React.ReactNode;
  placeholder?: string;
  size?: InputBaseSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

type NativeProps = Omit<React.InputHTMLAttributes<any>, keyof OwnProps>;

export type InputProps = OwnProps & NativeProps;

const baseStyles = "w-full border border-gray-300 rounded-lg flex items-center overflow-hidden px-3";

const sizeStyles = {
  sm: "h-10",
  md: "h-12",
};

/**
 * TextInput component that integrates with remix-validated-form.
 * Also so we can switch out the underlying component without affecting things higher up the tree.
 */
export function Input({ name, iconLeft, iconRight, size = "md", ...props }: InputProps) {
  return (
    <div className={clsx(baseStyles, sizeStyles[size])}>
      {iconLeft}
      <input {...props} name={name} className="w-full h-12 text-sm outline-none placeholder:text-gray-400" />
      {iconRight}
    </div>
  );
}

/** Integration with remix-validated-form */
export function ValidatedInput(props: InputProps & { name: string }) {
  const { getInputProps } = useField(props.name);
  return <Input {...getInputProps(props)} />;
}
