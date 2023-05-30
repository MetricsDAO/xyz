import { useOutletContext } from "@remix-run/react";
import type { MarketplaceData } from "~/domain/labor-market/schemas";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new";
import { MarketplaceDetails } from "~/features/labor-market-creator/marketplace-details";

export default function Step1Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <MarketplaceDetails
      currentData={formData.marketplaceData}
      tokens={tokens}
      projects={projects}
      onDataUpdate={(data: MarketplaceData) => {
        setFormData((prevData) => ({ ...prevData, marketplaceData: data }));
      }}
    />
  );
}
