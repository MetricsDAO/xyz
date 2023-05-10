import { useOutletContext } from "@remix-run/react";
import type { GatingData } from "~/domain/labor-market/schemas";
import { ReviewerPermissions } from "~/features/markets/new-market/reviewer-permissions";
import type { OutletContext } from "./market_.new2";

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
