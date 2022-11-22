import clsx from "clsx";

export type InputBaseSize = "sm" | "md";

export type InputBaseProps = {
  size: InputBaseSize;
  children: React.ReactNode;
  isError?: boolean;
};

const baseStyles = "inline-flex items-center justify-center border border-gray-200 w-full overflow-hidden rounded-lg";

const sizeStyles: Record<InputBaseSize, string> = {
  sm: "h-10 text-base",
  md: "h-12 text-xs",
};

const errorStyles = "ring-1 ring-red-500";
/** Base input wrapper with styling for errors */
export function InputWrapper({ size, children, isError = false }: InputBaseProps) {
  const classes = clsx(baseStyles, sizeStyles[size], { [errorStyles]: isError });
  return <div className={classes}>{children}</div>;
}
