import { useNavigate, useOutletContext } from "@remix-run/react";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new";
import { MarketplaceMetaForm } from "~/features/labor-market-creator/meta-form";
import type { MarketplaceMeta } from "~/features/labor-market-creator/schema";
import { FormStepper } from "~/components";
import { BadgerLinks } from "~/features/labor-market-creator/badger-links";

export default function NewMarketplaceMetaPage() {
  const navigate = useNavigate();
  const [formState, setFormData] = useOutletContext<OutletContext>();
  const tokens = useTokens();
  const projects = useProjects();

  const onSubmit = (values: MarketplaceMeta) => {
    setFormData((prevData) => ({ ...prevData, meta: values }));
    navigate(`/app/market/new/sponsor-permissions`);
  };

  return (
    <div className="flex relative min-h-screen">
      <MarketplaceMetaForm currentData={formState.meta} tokens={tokens} projects={projects} onSubmit={onSubmit} />
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
