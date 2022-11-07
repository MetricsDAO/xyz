import { useState } from "react";
import { useHarmonicIntervalFn } from "react-use";

export function useUpdateInterval(interval: number) {
  const [, setTick] = useState(0);
  useHarmonicIntervalFn(() => setTick((i) => i + 1), interval);
}
