import { useOutletContext } from "@remix-run/react";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import type { OutletContext } from "./market_.new";
import { Review } from "~/features/labor-market-creator/review";

export default function MarketplaceReview() {
  const [formData] = useOutletContext<OutletContext>();
  const tokens = useTokens();
  const projects = useProjects();
  return (
    <Review
      tokens={tokens}
      projects={projects}
      marketplaceData={formData?.meta}
      sponsorData={formData?.sponsor}
      analystData={formData?.analyst}
      reviewerData={formData?.reviewer}
    />
  );
}
