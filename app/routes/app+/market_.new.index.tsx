import { useNavigate, useOutletContext } from "@remix-run/react";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";
import { MarketplaceMetaForm } from "~/features/labor-market-creator/metadata-form";
import type { MarketplaceMeta } from "~/features/labor-market-creator/schema";
import type { OutletContext } from "./market_.new";

export default function NewMarketplaceMetaPage() {
  const navigate = useNavigate();
  const [formState, setFormData] = useOutletContext<OutletContext>();

  const onNext = (values: MarketplaceMeta) => {
    setFormData((prevData) => ({ ...prevData, meta: values }));
    navigate(`/app/market/new/sponsor-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <MarketplaceMetaForm defaultValues={formState.meta} onNext={onNext} />
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={1}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <BadgerLinks />
      </aside>
    </div>
  );
}
