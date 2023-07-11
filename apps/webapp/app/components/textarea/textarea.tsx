import React from "react";
import { useField } from "remix-validated-form";
type Props = Omit<JSX.IntrinsicElements["textarea"], "ref">;

/**
 * Textarea component that integrates with remix-validated-form.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  return (
    <textarea {...props} className="w-full outline-none p-3 border border-gray-300 text-sm rounded-lg" ref={ref} />
  );
});

Textarea.displayName = "Textarea";

export function ValidatedTextarea(props: Props & { name: string }) {
  const { getInputProps } = useField(props.name);
  return <Textarea {...getInputProps(props)} />;
}
