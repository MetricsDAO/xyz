import type { DataFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { Container } from "~/components";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { fakeLaborMarketFormValues, LaborMarketCreator } from "~/features/labor-market-creator";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const projects = await listProjects();
  const tokens = await listTokens();
  const defaultValues = url.searchParams.get("fake")
    ? fakeLaborMarketFormValues()
    : { appData: { type: params.type as "analyze" | "brainstorm" } };
  return typedjson({ projects, tokens, defaultValues });
};

export default function CreateMarketplace() {
  const { mType } = useParams();
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold antialiased">
          Create {mType === "brainstorm" ? "a Brainstorm" : "an Analytics"} Marketplace
        </h1>

        <LaborMarketCreator projects={projects} tokens={tokens} defaultValues={defaultValues} />
      </div>
    </Container>
  );
}
