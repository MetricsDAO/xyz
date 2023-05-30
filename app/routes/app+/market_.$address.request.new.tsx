import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { AppDataForm, AnalystForm, ReviewerForm } from "~/features/service-request-creator/schema";
import { requireUser } from "~/services/session.server";

export type OutletContext = [formState, React.Dispatch<React.SetStateAction<formState>>];

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUser(request, `/app/login?redirectto=app/market/$address/request/new`);
  //todo - actual address
  return null;
};

interface formState {
  page1Data: AppDataForm | null;
  page2Data: AnalystForm | null;
  page3Data: ReviewerForm | null;
}

const initialFormState: formState = {
  page1Data: null,
  page2Data: null,
  page3Data: null,
};

export default function NewMarketRoute() {
  const [formData, setFormData] = useState<formState>(initialFormState);

  return <Outlet context={[formData, setFormData]} />;
}
