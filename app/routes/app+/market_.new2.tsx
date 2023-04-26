import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import type { step1Data, step2Data } from "~/domain/labor-market/schemas";
import { requireUser } from "~/services/session.server";

export type OutletContext = [formState, React.Dispatch<React.SetStateAction<formState>>];

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUser(request, `/app/login?redirectto=app/market/new2`);
  return null;
};

interface formState {
  page1Data: step1Data | null;
  page2Data: step2Data | null;
  page3Data: step2Data | null;
  // Add more pages as needed
}

const initialFormState: formState = {
  page1Data: null,
  page2Data: null,
  page3Data: null,
  // Add more pages as needed
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
