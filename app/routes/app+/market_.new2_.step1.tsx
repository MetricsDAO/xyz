import type { DataFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { fakeLaborMarketFormValues, NewMarket } from "~/features/markets/new-market";
import { requireUser } from "~/services/session.server";
import { Step1 } from "~/features/markets/new-market/step1";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const url = new URL(request.url);
  await requireUser(request, `/app/login?redirectto=app/market/new`);

  const projects = await listProjects();
  const tokens = await listTokens();
  return typedjson({ projects, tokens });
};

export default function Step1Route() {
  const { projects, tokens } = useTypedLoaderData<typeof loader>();
  return <Step1 tokens={tokens} projects={projects} />;
}
