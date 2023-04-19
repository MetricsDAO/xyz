import { Outlet, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import type { step1Data } from "~/domain/labor-market/schemas";

// Define the type for the Context
export type step1DataType = {
  step1Data: step1Data;
  setStep1Data: (step1Data: step1Data) => void;
};

export default function NewMarketRoute() {
  const [step1Data, setStep1Data] = useState<step1DataType | null>(null);
  console.log("step1Data", step1Data);

  return <Outlet context={[step1Data, setStep1Data]} />;
}
