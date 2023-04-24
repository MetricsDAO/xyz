import { useOutletContext } from "@remix-run/react";
import type { step1Data } from "~/domain/labor-market/schemas";
import { Step1 } from "~/features/markets/new-market/step1";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new2";

export default function Step1Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <Step1
      currentData={formData.page1Data}
      tokens={tokens}
      projects={projects}
      onDataUpdate={(data: step1Data) => {
        setFormData((prevData) => ({ ...prevData, page1Data: data }));
      }}
    />
  );
}
