import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { step1Data } from "~/domain/labor-market/schemas";
import { Step1 } from "~/features/markets/new-market/step1";
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

export default function NewMarketRoute({ onDataUpdate }: Props) {
  const { projects, tokens } = useTypedLoaderData<typeof loader>();
  const [page, setPage] = useState<number>(1);

  const [step1Data, setStep1Data] = useState<step1Data | null>(null);

  const handleStep1StateUpdate = (values: step1Data) => {
    console.log("values", values);
    setStep1Data(values);
  };

  const handlePageChange = (newPage: number) => {
    console.log("page", newPage);
    setPage(newPage);
  };

  return (
    page === 1 && (
      <Step1
        tokens={tokens}
        projects={projects}
        onDataUpdate={handleStep1StateUpdate}
        onPageChange={handlePageChange}
      />
    )
  );
}
