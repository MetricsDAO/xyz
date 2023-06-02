import { useNavigate, useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.new";
import { SponsorPermissionsForm } from "~/features/labor-market-creator/sponsor-permissions-form";
import type { GatingData } from "~/features/labor-market-creator/schema";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";

export default function SponsorPermissionsPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onNext = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, sponsor: values }));
    navigate(`/app/market/new/analyst-permissions`);
  };

  const onPrevious = (values: GatingData) => {
    setFormData((prevData) => ({ ...prevData, sponsor: values }));
    navigate(`/app/market/new`);
  };

  return (
    <div className="flex relative min-h-screen">
      <SponsorPermissionsForm defaultValues={formData.sponsor} onNext={onNext} onPrevious={onPrevious} />
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={2}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <BadgerLinks />
      </aside>
    </div>
  );
}
