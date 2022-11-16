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

export function Button({ asChild, fullWidth, size = "md", className, variant = "primary", ...props }: Props) {
  const classes = clsx(
    { "w-full": fullWidth },
    // Sizes
    { "px-3 py-3 text-sm": size === "sm" },
    { "px-4 h-10 text-sm": size === "md" },
    { "px-4 py-3 text-base": size === "lg" },
    { "bg-gradient-to-r from-[#A0DDA9] to-[#01C2FF] text-black/90": variant === "gradient" },
    // Variants
    { "bg-sky-500 text-white": variant === "primary" },
    { "border border-blue-500 text-blue-500": variant === "outline" },
    { "bg-red-500 text-white": variant === "danger" },
    { "bg-white ring-1 ring-black/10 text-gray-900": variant === "cancel" },
    // Base styles
    "rounded-lg tracking-wide font-medium cursor-pointer",
    "inline-block flex items-center justify-center",
    className
  );

  const Comp = asChild ? Slot : "button";
  return <Comp className={classes} {...props} />;
}
