import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Link, useParams, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { $params, $path } from "remix-routes";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { ProjectAvatar, TokenAvatar } from "~/components/avatar";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { ValidatedCombobox } from "~/components/combobox";
import { Container } from "~/components/container";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Pagination } from "~/components/pagination/pagination";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { LaborMarketSearchSchema } from "~/domain/labor-market";
import { countLaborMarkets, searchLaborMarkets } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

const validator = withZod(LaborMarketSearchSchema);

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const url = new URL(request.url);

  url.searchParams.set("type", $params("/app/:mType", params).mType);

  const searchParams = getParamsOrFail(url.searchParams, LaborMarketSearchSchema);
  const marketplaces = await searchLaborMarkets(searchParams);
  const totalResults = await countLaborMarkets(searchParams);
  const tokens = await listTokens();
  const projects = await listProjects();
  return typedjson(
    {
      searchParams,
      marketplaces,
      totalResults,
      tokens,
      projects,
    },
    { status: 200 }
  );
};

export default function MarketplaceCollection() {
  const { marketplaces, totalResults, searchParams, projects, tokens } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const { mType } = useParams();

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <Container className="py-16">
      <header className="flex flex-col justify-between md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 mb-20">
        {mType === "brainstorm" ? <BrainstormDescription /> : <AnalyzeDescription />}
        <aside>
          <Button size="lg" asChild>
            <Link to={$path("/app/:mType/new", { mType: mType })}>Create Marketplace</Link>
          </Button>
        </aside>
      </header>

      <h2 className="text-lg font-semibold border-b border-gray-200 py-4 mb-6">
        {mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplaces{" "}
        <span className="text-gray-400">({totalResults})</span>
      </h2>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesListView marketplaces={marketplaces} />
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
                  { label: "Trending", value: "trending" },
                  { label: "Active Challenges", value: "serviceRequests" },
                  { label: "Chain/Project", value: "project" },
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
                options={tokens.map((token) => ({ label: token.name, value: token.symbol }))}
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

type MarketplaceTableProps = {
  marketplaces: UseDataFunctionReturn<typeof loader>["marketplaces"];
};

function MarketplacesListView({ marketplaces }: MarketplaceTableProps) {
  if (marketplaces.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <MarketplacesTable marketplaces={marketplaces} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <MarketplacesCard marketplaces={marketplaces} />
      </div>
    </>
  );
}

function MarketplacesTable({ marketplaces }: MarketplaceTableProps) {
  const { mType } = useParams();

  return (
    <Table>
      <Header columns={6} className="text-xs text-gray-500 font-medium mb-2">
        <Header.Column span={2}>{mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplace</Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Challenge Pool Totals</Header.Column>
        <Header.Column>Avg. Challenge Pool</Header.Column>
        <Header.Column>Active Challenges</Header.Column>
      </Header>
      {marketplaces.map((m) => {
        return (
          <Row asChild columns={6} key={m.address}>
            <Link
              to={$path("/app/:mType/m/:laborMarketAddress", { mType: m.type, laborMarketAddress: m.address })}
              className="text-sm font-medium"
            >
              <Row.Column span={2}>{m.title}</Row.Column>
              <Row.Column>
                <div className="flex items-center gap-2 flex-wrap">
                  {m.projects.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectAvatar project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>
              </Row.Column>

              <Row.Column>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>
              </Row.Column>

              <Row.Column>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>
              </Row.Column>

              <Row.Column>{m._count.serviceRequests.toLocaleString()}</Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function MarketplacesCard({ marketplaces }: MarketplaceTableProps) {
  const { mType } = useParams();
  return (
    <div>
      <div className="space-y-4">
        {marketplaces.map((m) => {
          return (
            <Card asChild key={m.address}>
              <Link
                to={`/app/${m.type}/m/${m.address}`}
                className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
              >
                <div>{mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplace</div>
                <div className="text-sm font-medium">{m.title}</div>

                <div>Chain/Project</div>
                <div className="flex flex-wrap gap-2">
                  {m.projects.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectAvatar project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>

                <div>Challenge Pool Totals</div>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div>Avg. Challenge Pool</div>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div>Active Challenges</div>
                <div>{m._count.serviceRequests.toLocaleString()}</div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
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
