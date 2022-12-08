import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type CardProps = {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Card({ asChild, className, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={clsx(
        "bg-white hover:bg-gray-100/50 ring-1 ring-black/5 ring-inset shadow shadow-black/5 rounded-lg transition-colors",
        className
      )}
      {...props}
    />
  );
}
