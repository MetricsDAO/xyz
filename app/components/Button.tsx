import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Props = {
  fullWidth?: boolean;
  asChild?: boolean;
  className?: string;
  variant?: "primary" | "gradient" | "outline" | "danger" | "cancel";
  children?: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "h-12 px-6 text-base",
};

const variantClasses = {
  primary: "bg-sky-500 text-white",
  gradient: "bg-gradient-to-r from-[#A0DDA9] to-[#01C2FF] text-black/90",
  outline: "border border-sky-200 text-sky-500 hover:bg-sky-100 shadow",
  danger: "bg-red-500 hover:bg-red-700 text-white",
  cancel: "bg-white ring-1 ring-black/10 hover:bg-black/5 text-gray-900",
};

export function Button({ asChild, fullWidth, size = "md", className, variant = "primary", loading, ...props }: Props) {
  const classes = clsx(
    { "w-full": fullWidth },
    "rounded-lg tracking-wide font-medium cursor-pointer",
    "inline-block flex items-center justify-center",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const Comp = asChild ? Slot : "button";
  return <Comp className={classes} {...props} />;
}
