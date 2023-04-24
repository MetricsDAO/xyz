import { NavLink, Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { step1Data, step2Data } from "~/domain/labor-market/schemas";
import { Step1 } from "~/features/markets/new-market/step1";
import { Step2 } from "~/features/markets/new-market/step2";
import { listProjects } from "~/services/projects.server";
import { requireUser } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const url = new URL(request.url);
  await requireUser(request, `/app/login?redirectto=app/market/new`);

  const projects = await listProjects();
  const tokens = await listTokens();
  return typedjson({ projects, tokens });
};

interface Props {
  onDataUpdate: (values: step1Data) => void;
}
interface formState {
  page1Data: step1Data | null;
  page2Data: step1Data | null;
  // Add more pages as needed
}

const initialFormState: formState = {
  page1Data: null,
  page2Data: null,
  // Add more pages as needed
};

type FormData = step1Data | step2Data;

export default function NewMarketRoute({ onDataUpdate }: Props) {
  const { projects, tokens } = useTypedLoaderData<typeof loader>();
  const [page, setPage] = useState<number>(2);
  console.log("page", page);

  const [formData, setFormData] = useState<formState>(initialFormState);

  const updateData = (page: keyof formState, newData: FormData) => {
    setFormData((prevData) => ({ ...prevData, [page]: newData }));
  };

  const handlePageNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleGoBack = () => {
    setPage((prevPage) => prevPage - 1);
    // Add any custom logic needed before going back here
  };

  const [counter, setCounter] = useState<number>(0);

  return (
    <div>
      <p>The count is {counter}</p>
      <Outlet context={[counter, setCounter]} />
    </div>
  );

  // switch (page) {
  //   case 1:
  //     return (
  //       <Step1
  //         currentData={formData.page1Data}
  //         tokens={tokens}
  //         projects={projects}
  //         onDataUpdate={(data: step1Data) => updateData("page1Data", data)}
  //         onNextPage={handlePageNext}
  //       />
  //     );
  //   case 2:
  //     return (
  //       <Step2
  //         onDataUpdate={(data: step2Data) => updateData("page2Data", data)}
  //         onNextPage={handlePageNext}
  //         onGoBack={handleGoBack}
  //       />
  //     );
  // }
}
