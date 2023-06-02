import { useNavigate, useOutletContext } from "@remix-run/react";
import { LaborMarketCreatorForm } from "~/features/labor-market-creator/labor-market-creator-form";
import type { OutletContext } from "./market_.new";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";

export default function NewMarketplaceReviewPage() {
  const [formData] = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onPrevious = () => {
    // TODO: update values?
    navigate(`/app/market/new/reviewer-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <LaborMarketCreatorForm onPrevious={onPrevious} defaultValues={formData} />
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={5}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <BadgerLinks />
      </aside>
    </div>
  );
}
