import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

export function Field({ children }: { children: ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="text-xs">{children}</label>;
}

export function Error({ children, name }: { children: ReactNode; name: string }) {
  const { error } = useField(name);
  if (!error) return null;
  return <p className="text-red-500 text-sm">{error}</p>;
}

export function Explainer({ children }: { children: ReactNode }) {
  return <p className="text-gray-500 text-sm">{children}</p>;
}
