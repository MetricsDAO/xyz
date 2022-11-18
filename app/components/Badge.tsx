import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Props = {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ asChild, className, ...props }: Props) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={clsx(
        "flex items-center text-sm text-gray-700 bg-zinc-100 rounded-full px-2 h-8 w-fit whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}
