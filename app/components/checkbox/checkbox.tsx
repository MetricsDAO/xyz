import { CheckIcon } from "@heroicons/react/20/solid";
import * as RadixCheckbox from "@radix-ui/react-checkbox";

type CheckboxProps = { label: React.ReactNode } & RadixCheckbox.CheckboxProps;

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <RadixCheckbox.Root {...props} className="w-4 h-4 rounded ring-1 ring-inset ring-black/10">
        <RadixCheckbox.Indicator>
          <CheckIcon />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={props.name}>{label}</label>
    </div>
  );
}
