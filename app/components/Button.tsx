import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Props = {
  fullWidth?: boolean;
  asChild?: boolean;
  className?: string;
  variant?: "primary" | "gradient" | "outline" | "danger";
  children?: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
};

export function Button({ asChild, fullWidth, size = "md", className, variant = "primary", ...props }: Props) {
  const classes = clsx(
    { "w-full": fullWidth },
    { "px-3 py-3 rounded-lg text-sm": size === "sm" },
    { "px-4 h-10 rounded-lg text-sm": size === "md" },
    { "px-4 py-4 rounded-xl text-lg": size === "lg" },
    { "bg-gradient-to-r from-[#A0DDA9] to-[#01C2FF] text-black/90": variant === "gradient" },
    { "bg-blue-500 text-white": variant === "primary" },
    { "border border-blue-500 text-blue-500": variant === "outline" },
    { "bg-red-500 text-white": variant === "danger" },
    "tracking-wide font-medium",
    "inline-block flex items-center justify-center",
    className
  );

  const Comp = asChild ? Slot : "button";
  return <Comp className={classes} {...props} />;
}
