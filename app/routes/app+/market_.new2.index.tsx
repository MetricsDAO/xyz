import { useOutletContext } from "@remix-run/react";
import type { MarketplaceData } from "~/domain/labor-market/schemas";
import { MarketplaceDetails } from "~/features/markets/new-market/marketplace-details";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new2";

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