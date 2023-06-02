import { useOutletContext } from "@remix-run/react";
import { ReviewerPermissionsForm } from "~/features/labor-market-creator/reviewer-permissions-form";
import type { GatingData } from "~/features/labor-market-creator/schema";
import type { OutletContext } from "./market_.new";

export default function ReviewerPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  return (
    <ReviewerPermissionsForm
      currentData={formData.reviewer}
      onDataUpdate={(data: GatingData) => {
        setFormData((prevData) => ({ ...prevData, reviewer: data }));
      }}
    />
  );
}
