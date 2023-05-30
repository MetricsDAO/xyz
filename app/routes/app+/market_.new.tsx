import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import type { MarketplaceData, GatingData } from "~/domain/labor-market/schemas";
import { requireUser } from "~/services/session.server";

export type OutletContext = [formState, React.Dispatch<React.SetStateAction<formState>>];

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUser(request, `/app/login?redirectto=app/market`);
  return null;
};

interface formState {
  marketplaceData: MarketplaceData | null;
  sponsorData: GatingData | null;
  analystData: GatingData | null;
  reviewerData: GatingData | null;
}

const initialFormState: formState = {
  marketplaceData: null,
  sponsorData: null,
  analystData: null,
  reviewerData: null,
};

export default function NewMarketRoute() {
  const [formData, setFormData] = useState<formState>(initialFormState);

  return (
    <div>
      <p>{JSON.stringify(formData)}</p>
      <Outlet context={[formData, setFormData]} />
    </div>
  );
}
