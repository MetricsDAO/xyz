import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

export type BadgeProps = {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "transparent";
};

const variantStyles = {
  default: "bg-gray-100",
  transparent: "bg-transparent",
};

export function Badge({ asChild, className, variant = "default", ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={clsx(
        "inline-flex items-center justify-center text-sm text-gray-700 rounded-full px-3 h-8 w-fit whitespace-nowrap",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
