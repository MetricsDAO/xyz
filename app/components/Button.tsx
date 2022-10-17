import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Props = {
  fullWidth?: boolean;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export function Button({ asChild, fullWidth, size = "md", className, ...props }: Props) {
  const classes = clsx(
    { "w-full": fullWidth },
    { "px-3 py-3 rounded-lg text-sm": size === "sm" },
    { "px-4 py-3 rounded-xl": size === "md" },
    { "px-4 py-4 rounded-xl text-lg": size === "lg" },
    "tracking-wide text-white",
    "bg-neutral-900",
    "inline-block flex items-center justify-center",
    className
  );

  const Comp = asChild ? Slot : "button";
  return <Comp className={classes} {...props} />;
}
