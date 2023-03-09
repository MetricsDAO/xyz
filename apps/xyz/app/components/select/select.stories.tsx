import { useState } from "react";
import { Select } from "./select";

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
  { value: "4", label: "Four" },
  { value: "5", label: "Five" },
];

export const Basic = () => {
  const [value, setValue] = useState<string>();
  return (
    <div className="space-y-10 w-96">
      <h3 className="font-semibold">Sizes</h3>
      <div className="grid grid-cols-2 gap-4 w-[500px]">
        <Select options={options} size="sm" placeholder="Placeholder" value={value} onChange={setValue} />
        <Select options={options} size="md" placeholder="Placeholder" value={value} onChange={setValue} />
      </div>
      <h3>Single value</h3>
      <Select options={options} />
    </div>
  );
};
