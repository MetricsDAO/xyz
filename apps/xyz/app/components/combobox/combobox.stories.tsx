import { useState } from "react";
import { Combobox } from "./combobox";

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
  { value: "4", label: "Four" },
  { value: "5", label: "Five" },
  { value: "6", label: "Six" },
  { value: "7", label: "Seven" },
  { value: "8", label: "Eight" },
  { value: "9", label: "Nine" },
  { value: "10", label: "Ten" },
  { value: "11", label: "Eleven" },
];

export const Basic = () => {
  const [value, setValue] = useState<string[]>();
  return (
    <div className="w-96 space-y-6">
      <Combobox options={options} value={value} onChange={setValue} />
      <Combobox size="sm" options={options} value={value} onChange={setValue} />
    </div>
  );
};
