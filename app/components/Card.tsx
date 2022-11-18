import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type CardProps = {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Card({ asChild, className, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";
  return <Comp className={clsx("bg-white ring-1 ring-black/5 rounded-lg", className)} {...props} />;
}
