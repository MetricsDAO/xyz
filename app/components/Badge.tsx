import { Slot } from "@radix-ui/react-slot";

type Props = {
  children: React.ReactNode;
  asChild?: boolean;
};

export function Badge({ asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "span";
  return <Comp className="bg-gray-200 rounded-full px-2 py-1" {...props} />;
}
