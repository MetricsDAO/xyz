import { useNavigate, useOutletContext } from "@remix-run/react";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";
import { ReviewerPermissionsForm } from "~/features/labor-market-creator/reviewer-permissions-form";
import type { GatingData } from "~/features/labor-market-creator/schema";
import type { OutletContext } from "./market_.new";

export default function ReviewerPermissionsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useOutletContext<OutletContext>();

  const onNext = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, reviewer: values }));
    navigate(`/app/market/new/review`);
  };

  const onPrevious = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, reviewer: values }));
    navigate(`/app/market/new/analyst-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <ReviewerPermissionsForm defaultValues={formData.reviewer} onNext={onNext} onPrevious={onPrevious} />
      <aside className="w-1/4 py-28 ml-2 md:block hidden">
        <FormStepper
          step={4}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <BadgerLinks />
      </aside>
    </div>
  );
}
