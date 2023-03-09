import { useState } from "react";
import { SegmentedRadio } from "./segmented-radio";

export function Basic() {
  const [value, setValue] = useState("10");
  return (
    <SegmentedRadio
      value={value}
      setValue={setValue}
      name="example"
      options={[
        { label: "10", value: "10" },
        { label: "25", value: "25" },
        { label: "50", value: "50" },
        { label: "75", value: "75" },
        { label: "100", value: "100" },
      ]}
    />
  );
}
