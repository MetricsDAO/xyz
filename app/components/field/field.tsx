import { Transition } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

export function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("space-y-3", className)}>{children}</div>;
}

const labelStyles = {
  sm: "text-xs font-medium text-gray-700",
  md: "text-sm font-medium text-gray-500",
  lg: "text-base font-bold text-gray-700",
};

export function Label({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return <label className={clsx("block", labelStyles[size], className)}>{children}</label>;
}

export function Error({ name }: { name: string }) {
  const { error } = useField(name);

  return (
    <Transition
      show={Boolean(error)}
      enter="transition duration-200"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-1 translate-y-0"
    >
      <p className="text-red-500 text-sm font-medium py-1">{error}</p>
    </Transition>
  );
}

export function Explainer({ children }: { children: ReactNode }) {
  return <p className="text-gray-500 text-sm">{children}</p>;
}
