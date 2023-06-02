import { useOutletContext } from "@remix-run/react";
import { LaborMarketCreator } from "~/features/labor-market-creator/labor-market-creator";
import type { OutletContext } from "./market_.new";

export default function NewMarketplaceReviewPage() {
  const [formData] = useOutletContext<OutletContext>();
  return <LaborMarketCreator currentData={formData} />;
}
