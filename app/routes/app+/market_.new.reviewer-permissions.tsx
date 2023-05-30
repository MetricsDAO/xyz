import { useOutletContext } from "@remix-run/react";
import type { GatingData } from "~/domain/labor-market/schemas";
import type { OutletContext } from "./market_.new";
import { ReviewerPermissions } from "~/features/labor-market-creator/reviewer-permissions";

export default function ReviewerPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <ReviewerPermissions
        currentData={formData.reviewerData}
        onDataUpdate={(data: GatingData) => {
          setFormData((prevData) => ({ ...prevData, reviewerData: data }));
        }}
      />
    </div>
  );
}
