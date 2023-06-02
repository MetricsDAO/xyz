import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import type { MarketplaceMeta, GatingData } from "~/features/labor-market-creator/schema";
import { requireUser } from "~/services/session.server";

export type OutletContext = [MarketplaceFormState, React.Dispatch<React.SetStateAction<MarketplaceFormState>>];

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUser(request, `/app/login?redirectto=app/market`);
  return null;
};

interface MarketplaceFormState {
  meta: MarketplaceMeta | null;
  sponsor: GatingData | null;
  analyst: GatingData | null;
  reviewer: GatingData | null;
}

const initialForm: MarketplaceFormState = {
  meta: null,
  sponsor: null,
  analyst: null,
  reviewer: null,
};

export default function NewMarketRoute() {
  const [formState, setFormState] = useState<MarketplaceFormState>(initialForm);

  return (
    <div>
      <Outlet context={[formState, setFormState]} />
    </div>
  );
}
