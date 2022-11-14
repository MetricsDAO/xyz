import { useState } from "react";
import { useInterval } from "@mantine/hooks";

export function useUpdateInterval(interval: number) {
  const [, setTick] = useState(0);
  useInterval(() => setTick((s) => s + 1), interval);
}
