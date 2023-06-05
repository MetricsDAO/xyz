import { useNavigate, useOutletContext } from "@remix-run/react";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";
import { MarketplaceAppDataForm } from "~/features/labor-market-creator/app-data-form";
import type { AppData } from "~/features/labor-market-creator/schema";
import type { OutletContext } from "./market_.new";

export default function NewMarketplaceMetaPage() {
  const navigate = useNavigate();
  const [formState, setFormData] = useOutletContext<OutletContext>();

  const onNext = (values: AppData) => {
    setFormData((prevData) => ({ ...prevData, appData: values }));
    navigate(`/app/market/new/sponsor-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <MarketplaceAppDataForm defaultValues={formState.appData} onNext={onNext} />
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
