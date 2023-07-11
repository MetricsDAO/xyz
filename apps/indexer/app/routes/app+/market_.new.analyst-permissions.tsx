import { useNavigate, useOutletContext } from "@remix-run/react";
import { AnalystPermissionsForm } from "~/features/labor-market-creator/analyst-permissions-form";
import type { OutletContext } from "./market_.new";
import type { GatingData } from "~/features/labor-market-creator/schema";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";

export default function AnalystPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const onNext = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, analyst: values }));
    navigate(`/app/market/new/reviewer-permissions`);
  };

  const onPrevious = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, analyst: values }));
    navigate(`/app/market/new/sponsor-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <AnalystPermissionsForm defaultValues={formData.analyst} onNext={onNext} onPrevious={onPrevious} />
      <aside className="w-1/4 py-28 ml-2 md:block hidden">
        <FormStepper
          step={3}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <BadgerLinks />
      </aside>
    </div>
  );
}
