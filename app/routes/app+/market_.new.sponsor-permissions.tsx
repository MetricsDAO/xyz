import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.new";
import { SponsorPermissionsForm } from "~/features/labor-market-creator/sponsor-permissions-form";
import type { GatingData } from "~/features/labor-market-creator/schema";

export default function SponsorPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  return (
    <SponsorPermissionsForm
      currentData={formData.sponsor}
      onDataUpdate={(data: GatingData) => {
        setFormData((prevData) => ({ ...prevData, sponsor: data }));
      }}
    />
  );
}
