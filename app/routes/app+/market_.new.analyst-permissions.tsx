import { useOutletContext } from "@remix-run/react";
import { AnalystPermissionsForm } from "~/features/labor-market-creator/analyst-permissions-form";
import type { OutletContext } from "./market_.new";
import type { GatingData } from "~/features/labor-market-creator/schema";

export default function AnalystPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  return (
    <AnalystPermissionsForm
      currentData={formData.analyst}
      onDataUpdate={(data: GatingData) => {
        setFormData((prevData) => ({ ...prevData, analyst: data }));
      }}
    />
  );
}
