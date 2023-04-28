import { useOutletContext } from "@remix-run/react";
import type { finalMarketData } from "~/domain/labor-market/schemas";
import { FinalStep } from "~/features/markets/new-market/review";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new2";

export default function MarketplaceReview() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <div>
      <FinalStep
        tokens={tokens}
        projects={projects}
        page1Data={formData?.page1Data}
        page2Data={formData?.page2Data}
        page3Data={formData?.page3Data}
        page4Data={formData?.page4Data}
      />
    </div>
  );
}
