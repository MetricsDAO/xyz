import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import React from "react";

const baseStyles =
  "rounded-lg font-medium cursor-pointer inline-flex items-center justify-center transition-colors duration-200 ease-in-out whitespace-nowrap";

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  none: "",
} as const;

const variantClasses = {
  primary: "bg-sky-500 text-white",
  gradient: "bg-gradient-to-r from-[#A0DDA9] to-[#01C2FF] text-black/90",
  link: "text-sky-500",
  outline: "border border-sky-200 text-sky-500 hover:bg-sky-100 shadow",
  danger: "bg-red-500 hover:bg-red-700 text-white",
  cancel: "bg-white ring-1 ring-black/10 hover:bg-black/5 text-gray-900",
} as const;

type Props = React.ComponentProps<"button"> & {
  asChild?: boolean;
  fullWidth?: boolean;
  className?: string;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
  onClick?: () => void;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { fullWidth, asChild, className, variant = "primary", size = "md", loading, ...rest } = props;
  const Comp = asChild ? Slot : "button";
  const classes = clsx({ "w-full": fullWidth }, baseStyles, sizeClasses[size], variantClasses[variant], className);
  return <Comp className={classes} {...rest} ref={ref} />;
});

Button.displayName = "Button";
