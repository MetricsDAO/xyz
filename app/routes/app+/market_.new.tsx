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

export interface MarketplaceFormState {
  meta?: MarketplaceMeta;
  sponsor?: GatingData;
  analyst?: GatingData;
  reviewer?: GatingData;
}

// Takes advantage of Outlet to maintain state across pages. If a user refreshes, state will be lost (not persisted on any backend)
export default function NewMarketRoute() {
  const [formState, setFormState] = useState<MarketplaceFormState>({});

  return (
    <div>
      <Outlet context={[formState, setFormState]} />
    </div>
  );
}
