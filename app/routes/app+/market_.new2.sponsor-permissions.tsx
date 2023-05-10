import { useOutletContext } from "@remix-run/react";
import type { GatingData } from "~/domain/labor-market/schemas";
import { SponsorPermissions } from "~/features/markets/new-market/sponsor-permissions";
import type { OutletContext } from "./market_.new2";

export default function SponsorPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <SponsorPermissions
        currentData={formData.sponsorData}
        onDataUpdate={(data: GatingData) => {
          setFormData((prevData) => ({ ...prevData, sponsorData: data }));
        }}
      />
    </div>
  );
}
