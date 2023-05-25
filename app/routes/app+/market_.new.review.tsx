import { useOutletContext } from "@remix-run/react";
import { Review } from "~/features/markets/new-market/review";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new";

export default function MarketplaceReview() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <div>
      <Review
        tokens={tokens}
        projects={projects}
        marketplaceData={formData?.marketplaceData}
        sponsorData={formData?.sponsorData}
        analystData={formData?.analystData}
        reviewerData={formData?.reviewerData}
      />
    </div>
  );
}
