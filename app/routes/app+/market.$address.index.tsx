import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import type { Project, Token } from "@prisma/client";
import { Link, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Card } from "~/components/card";
import { ValidatedCombobox } from "~/components/combobox";
import { Countdown } from "~/components/countdown";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input/input";
import { Pagination } from "~/components/pagination/pagination";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { ServiceRequestSearchSchema } from "~/domain/service-request";
import { ProjectBadges } from "~/features/project-badges";
import { useMarketAddressData } from "~/hooks/use-market-address-data";
import { listProjects } from "~/services/projects.server";
import { countServiceRequests, searchServiceRequests } from "~/services/service-request.server";
import { listTokens } from "~/services/tokens.server";
import { findProjectsBySlug, fromTokenAmount, toTokenAbbreviation } from "~/utils/helpers";

const validator = withZod(ServiceRequestSearchSchema);

const paramsSchema = z.object({ address: z.string() });

export const loader = async (data: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(data.params);

  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ServiceRequestSearchSchema);
  const paramsWithLaborMarketId = { ...params, laborMarket: address };
  const serviceRequests = await searchServiceRequests(paramsWithLaborMarketId);
  const totalResults = await countServiceRequests(paramsWithLaborMarketId);
  const projects = await listProjects();
  const tokens = await listTokens();

  return typedjson({
    serviceRequests,
    totalResults,
    params,
    projects,
    tokens,
  });
};

export default function MarketplaceIdChallenges() {
  const { totalResults, params, serviceRequests, projects, tokens } = useTypedLoaderData<typeof loader>();
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <ChallengesListView serviceRequests={serviceRequests} projects={projects} tokens={tokens} />
          <div className="w-fit m-auto">
            <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
          </div>
        </div>
      </main>
      <aside className="md:w-1/5">
        <SearchAndFilter tokens={tokens} projects={projects} />
      </aside>
    </section>
  );
}

function SearchAndFilter({ tokens, projects }: { tokens: Token[]; projects: Project[] }) {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-blue-300 bg-opacity-5"
    >
      <ValidatedInput
        placeholder="Search"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />
      <h3 className="font-semibold">Sort:</h3>
      <ValidatedSelect
        placeholder="Select option"
        name="sortBy"
        onChange={handleChange}
        size="sm"
        options={[
          { label: "New", value: "createdAtBlockTimestamp" },
          { label: "Title", value: "appData.title" },
          { label: "Submit Deadline", value: "configuration.submissionExpiration" },
          { label: "Review Deadline", value: "configuration.enforcementExpiration" },
        ]}
      />
      <h3 className="font-semibold">Filter:</h3>
      {/* MVP Hide */}
      {/* <p>I am able to:</p>
      <Checkbox id="submit_checkbox" name="permission" value="submit" label="Submit" />
      <Checkbox id="review_checkbox" name="permission" value="review" label="Review" /> */}
      <Field>
        <Label>Reward Token</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="reward"
          size="sm"
          options={tokens.map((t) => ({ label: t.name, value: t.contractAddress }))}
        />
      </Field>
      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="project"
          size="sm"
          options={projects.map((p) => ({ value: p.slug, label: p.name }))}
        />
      </Field>
      <Field>
        <Label>Language</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="language"
          size="sm"
          options={[{ label: "English", value: "english" }]}
        />
      </Field>
    </ValidatedForm>
  );
}

type MarketplaceChallengesTableProps = {
  serviceRequests: UseDataFunctionReturn<typeof loader>["serviceRequests"];
  projects: UseDataFunctionReturn<typeof loader>["projects"];
  tokens: UseDataFunctionReturn<typeof loader>["tokens"];
};

function MarketplacesChallengesTable({ serviceRequests, projects, tokens }: MarketplaceChallengesTableProps) {
  const { laborMarket } = useMarketAddressData();

  return (
    <Table>
      <Header columns={6} className="text-xs text-gray-500 font-medium mb-2">
        <Header.Column span={2}>Challenge</Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Reward Pool</Header.Column>
        <Header.Column>Submit Deadline</Header.Column>
        <Header.Column>Review Deadline</Header.Column>
      </Header>
      {serviceRequests.map((sr) => {
        return (
          <Row asChild columns={6} key={sr.id}>
            <Link to={`/app/market/${laborMarket.address}/request/${sr.id}`} className="text-sm font-medium">
              <Row.Column span={2}>{sr.appData?.title}</Row.Column>
              <Row.Column>
                <div className="flex">
                  <ProjectBadges projects={findProjectsBySlug(projects, sr.appData?.projectSlugs ?? [])} />
                </div>
              </Row.Column>

              <Row.Column>{`${fromTokenAmount(sr.configuration.pTokenQuantity)} ${toTokenAbbreviation(
                sr.configuration.pToken,
                tokens
              )}`}</Row.Column>
              <Row.Column>
                <Countdown date={sr.configuration?.submissionExpiration} />
              </Row.Column>
              <Row.Column>
                <Countdown date={sr.configuration?.enforcementExpiration} />
              </Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function MarketplacesChallengesCard({ serviceRequests, projects, tokens }: MarketplaceChallengesTableProps) {
  const { laborMarket } = useMarketAddressData();

  return (
    <div className="space-y-4">
      {serviceRequests.map((sr) => {
        return (
          <Card asChild key={sr.id}>
            <Link
              to={`/app/${laborMarket?.appData?.type}/m/${laborMarket.address}/sr/${sr.id}`}
              className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
            >
              <div>Challenge</div>
              <div className="text-sm font-medium">{sr.appData?.title}</div>

              <div>Chain/Project</div>
              <div className="flex">
                <ProjectBadges projects={findProjectsBySlug(projects, sr.appData?.projectSlugs ?? [])} />
              </div>

              <div>Reward Pool</div>
              <div>
                {fromTokenAmount(sr.configuration.pTokenQuantity)}{" "}
                {tokens.find((t) => t.contractAddress === sr.configuration.pToken)?.symbol}
              </div>
              <div>Submit Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={sr.configuration?.submissionExpiration} />
              </div>
              <div>Review Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={sr.configuration?.enforcementExpiration} />
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

function ChallengesListView(props: MarketplaceChallengesTableProps) {
  if (props.serviceRequests.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <MarketplacesChallengesTable {...props} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <MarketplacesChallengesCard {...props} />
      </div>
    </>
  );
}
