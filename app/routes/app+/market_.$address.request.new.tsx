import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import type { AppDataForm, AnalystForm, ReviewerForm } from "~/features/service-request-creator/schema";
import { requireUser } from "~/services/session.server";

export type OutletContext = [ServiceRequestFormState, React.Dispatch<React.SetStateAction<ServiceRequestFormState>>];

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUser(request, `/app/login?redirectto=app/market/$address/request/new`);
  //todo - actual address
  return null;
};

export interface ServiceRequestFormState {
  appData: AppDataForm | null;
  analyst: AnalystForm | null;
  reviewer: ReviewerForm | null;
}

const initialFormState: ServiceRequestFormState = {
  appData: null,
  analyst: null,
  reviewer: null,
};

export default function NewServiceRequestRoute() {
  const [formData, setFormData] = useState<ServiceRequestFormState>(initialFormState);

  return <Outlet context={[formData, setFormData]} />;
}
