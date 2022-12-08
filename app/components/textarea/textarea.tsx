import { useField } from "remix-validated-form";
type Props = JSX.IntrinsicElements["textarea"];

/**
 * Textarea component that integrates with remix-validated-form.
 */
export function Textarea({ name, ...props }: Props) {
  return (
    <textarea name={name} {...props} className="w-full outline-none p-3 border border-gray-300 text-sm rounded-lg" />
  );
}

export function ValidatedTextarea(props: Props & { name: string }) {
  const { getInputProps } = useField(props.name);
  return <Textarea {...getInputProps(props)} />;
}
