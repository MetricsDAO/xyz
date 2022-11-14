import clsx from "clsx";
import { useField } from "remix-validated-form";

export type FieldProps = {
  name: string;
  level?: 1 | 2;
  label?: React.ReactNode;
  error?: React.ReactNode;
  explainer?: React.ReactNode;
  children?: React.ReactNode;
};

/** Mostly provides styling and layout for form fields and associated data.. */
export function Field({ children, name, error, label, level = 1 }: FieldProps & JSX.IntrinsicElements["input"]) {
  return (
    <div>
      {label ? (
        <label htmlFor={name} className="block text-sm mb-2">
          {label}
        </label>
      ) : null}

      {children}

      {error ? <div className="text-sm text-red-500 mt-1">{error}</div> : null}
    </div>
  );
}

export function FieldWrapper({ children, error }: { children: React.ReactNode; error?: React.ReactNode }) {
  return (
    <div
      className={clsx("border flex rounded-lg overflow-hidden", {
        "border-red-500": error,
        "border-gray-400/40": !error,
      })}
    >
      {children}
    </div>
  );
}
