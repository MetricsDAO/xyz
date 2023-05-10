import { useOutletContext } from "@remix-run/react";
import type { GatingData } from "~/domain/labor-market/schemas";
import { AnalystPermissions } from "~/features/markets/new-market/analyst-permissions";
import type { OutletContext } from "./market_.new2";

export default function AnalystPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <AnalystPermissions
        currentData={formData.analystData}
        onDataUpdate={(data: GatingData) => {
          setFormData((prevData) => ({ ...prevData, analystData: data }));
        }}
      />
    </div>
  );
}
