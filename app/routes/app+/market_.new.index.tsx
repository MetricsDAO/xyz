import { useOutletContext } from "@remix-run/react";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new";
import { MarketplaceMetaForm } from "~/features/labor-market-creator/meta-form";
import type { MarketplaceMeta } from "~/features/labor-market-creator/schema";

export default function MetaForm() {
  const [formState, setFormData] = useOutletContext<OutletContext>();
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <MarketplaceMetaForm
      currentData={formState.meta}
      tokens={tokens}
      projects={projects}
      onDataUpdate={(data: MarketplaceMeta) => {
        setFormData((prevData) => ({ ...prevData, meta: data }));
      }}
    />
  );
}
