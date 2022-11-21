import clsx from "clsx";

export function Container({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={clsx("container mx-auto max-w-7xl px-2", className)}>{children}</div>;
}
