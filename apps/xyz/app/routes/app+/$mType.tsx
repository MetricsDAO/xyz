import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Link, useParams, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { $params } from "remix-routes";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import { ValidatedCombobox } from "~/components/combobox";
import { Container } from "~/components/container";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Pagination } from "~/components/pagination/pagination";
import { ValidatedSelect } from "~/components/select";
import { countLaborMarkets, searchLaborMarkets } from "~/domain/labor-market/functions.server";
import { LaborMarketSearchSchema } from "~/domain/labor-market/schemas";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { MarketplacesListView } from "~/features/marketplaces-list-view";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

const validator = withZod(LaborMarketSearchSchema);

export type MarketplaceTableProps = {
  marketplaces: UseDataFunctionReturn<typeof loader>["marketplaces"];
  projects: UseDataFunctionReturn<typeof loader>["projects"];
  tokens: UseDataFunctionReturn<typeof loader>["tokens"];
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const url = new URL(request.url);
  url.searchParams.set("type", $params("/app/:mType", params).mType);
  const searchParams = getParamsOrFail(url.searchParams, LaborMarketSearchSchema);

  const marketplaces = await searchLaborMarkets(searchParams);
  const totalResults = await countLaborMarkets(searchParams);
  const tokens = await listTokens();
  const projects = await listProjects();
  return typedjson({
    searchParams,
    marketplaces,
    totalResults,
    tokens,
    projects,
  });
};

export default function MarketplaceCollection() {
  const { marketplaces, totalResults, searchParams, projects, tokens } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <Container className="py-24 px-10">
      <header className="flex flex-col justify-between md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 mb-20">
        {mType === "brainstorm" ? <BrainstormDescription /> : <AnalyzeDescription />}
        <aside>
          <ConnectWalletWrapper>
            <Button size="lg" asChild>
              <Link to={`/app/${mType}/new`}>Create Marketplace</Link>
            </Button>
          </ConnectWalletWrapper>
        </aside>
      </header>

      <h2 className="text-lg font-semibold border-b border-gray-200 py-4 mb-6">
        {mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplaces{" "}
        <span className="text-gray-400">({totalResults})</span>
      </h2>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesListView marketplaces={marketplaces} projects={projects} tokens={tokens} />
            <div className="w-fit m-auto">
              <Pagination page={searchParams.page} totalPages={Math.ceil(totalResults / searchParams.first)} />
            </div>
          </div>
        </main>

        <aside className="md:w-1/5">
          <ValidatedForm
            formRef={formRef}
            method="get"
            defaultValues={searchParams}
            validator={validator}
            onChange={handleChange}
            className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-blue-300 bg-opacity-5 text-sm"
          >
            <ValidatedInput
              placeholder="Search"
              name="q"
              size="sm"
              iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
            />

            <Field>
              <Label>Sort by</Label>
              <ValidatedSelect
                placeholder="Select option"
                name="sortBy"
                size="sm"
                onChange={handleChange}
                options={[
                  { label: "Active Challenges", value: "serviceRequestCount" },
                  { label: "New", value: "createdAtBlockTimestamp" },
                ]}
              />
            </Field>

            {/* <h3 className="font-semibold">Filter:</h3>
            <p className="text-gray-600">I'm able to:</p>
            <Checkbox name="can" label="Launch" value="launch" />
            <Checkbox name="can" label="Submit" value="submit" />
            <Checkbox name="can" label="Review" value="review" /> */}

            <Field>
              <Label>Reward Token</Label>
              <ValidatedCombobox
                name="token"
                onChange={handleChange}
                placeholder="Select option"
                size="sm"
                options={tokens.map((token) => ({ label: token.name, value: token.contractAddress }))}
              />
            </Field>

            <Field>
              <Label>Chain/Project</Label>
              <ValidatedCombobox
                name="project"
                size="sm"
                onChange={handleChange}
                placeholder="Select option"
                options={projects.map((p) => ({ value: p.slug, label: p.name }))}
              />
            </Field>
          </ValidatedForm>
        </aside>
      </section>
    </Container>
  );
}

function AnalyzeDescription() {
  return (
    <main className="flex-1 space-y-3 max-w-2xl">
      <h1 className="text-3xl font-semibold">Analytics Marketplaces</h1>
      <p className="text-lg text-cyan-500">
        Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
        projects launch, grow and succeed.
      </p>
      <p className="text-gray-500 text-sm">
        Explore Analytics marketplaces to launch or discover challenges. Claim challenges to submit your best work, or
        peer review others’ work to reward the highest quality outputs.
      </p>
    </main>
  );
}

function BrainstormDescription() {
  return (
    <main className="flex-1 space-y-3 max-w-2xl">
      <h1 className="text-3xl font-semibold">Brainstorm Marketplaces</h1>
      <p className="text-lg text-cyan-500">
        Source and prioritize questions, problems, or tooling needs for Web3 analysts to address.
      </p>
      <p className="text-gray-500 text-sm">
        Explore Brainstorm marketplaces to launch or discover challenges. Claim challenges to submit your best ideas, or
        peer review others’ to surface and reward the most relevant ideas. Outputs of a Brainstorm can prompt Analytics
        challenges.
      </p>
    </main>
  );
}
