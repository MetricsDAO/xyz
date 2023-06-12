import { DocumentDuplicateIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ValidatedForm } from "remix-validated-form";
import { useRef } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Link, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import type { CombinedDoc } from "~/domain/submission/schemas";
import { ShowcaseSearchSchema } from "~/domain/submission/schemas";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { fromNow } from "~/utils/date";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
import { Card } from "~/components/card";
import { findProjectsBySlug, submissionCreatedDate, truncateAddress } from "~/utils/helpers";
import { Container } from "~/components";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getParamsOrFail } from "remix-params-helper";
import { countShowcases, searchSubmissionsShowcase } from "~/domain/submission/functions.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { listProjects } from "~/services/projects.server";
import type { Project } from "@prisma/client";
import { ProjectBadges } from "~/features/project-badges";
import clsx from "clsx";
import { useOptionalUser } from "~/hooks/use-user";
import { findLaborMarkets } from "~/domain/labor-market/functions.server";
import type { LaborMarketDoc } from "~/domain/labor-market/schemas";
import { Pagination } from "~/components/pagination";

const validator = withZod(ShowcaseSearchSchema);

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, ShowcaseSearchSchema);
  const submissions = await searchSubmissionsShowcase({ ...search });
  const projects = await listProjects();
  const laborMarkets = await findLaborMarkets({});
  const totalSubmissions = await countShowcases({ ...search });
  return typedjson({
    submissions,
    search,
    projects,
    laborMarkets,
    totalSubmissions,
  });
};

export default function Showcase() {
  const { submissions, projects, search, laborMarkets, totalSubmissions } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Showcase</h1>
        <div>
          <p className="text-lg text-sky-500">Discover top analytics submissions across the ecosystem</p>
          <p className="text-gray-500 text-sm">Quickly surface winning submissions from any Marketplace</p>
        </div>
      </section>
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <div className="space-y-3 flex-1">
          <p className="font-semibold">Top Submissions</p>
          <hr className="bg-gray-200" />
          <SubmissionsListView submissions={submissions} projects={projects} />
          <div className="w-fit m-auto">
            <Pagination page={search.page} totalPages={Math.ceil(totalSubmissions / search.first)} />
          </div>
        </div>
        <aside className="md:w-1/4 lg:w-1/5 pt-11">
          <SearchAndFilter projects={projects} laborMarkets={laborMarkets} />
        </aside>
      </section>
    </Container>
  );
}

function SearchAndFilter({ projects, laborMarkets }: { projects: Project[]; laborMarkets: LaborMarketDoc[] }) {
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
      noValidate
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-blue-300 bg-opacity-5 text-sm sticky top-0"
    >
      <ValidatedInput
        placeholder="Search address"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />

      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox
          name="project"
          onChange={handleChange}
          placeholder="Select option"
          size="sm"
          options={projects.map((p) => ({ value: p.slug, label: p.name }))}
        />
      </Field>

      <Field>
        <Label>Score</Label>
        <ValidatedSelect
          name="score"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={[
            { label: "Stellar", value: "stellar" },
            { label: "Good", value: "good" },
          ]}
        />
      </Field>

      <Field>
        <Label>Timeframe</Label>
        <ValidatedSelect
          name="timeframe"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={[
            { label: "Past 24 hours", value: "day" },
            { label: "Past 7 days", value: "week" },
            { label: "Past 30 days", value: "month" },
          ]}
        />
      </Field>

      <Field>
        <Label>Marketplace</Label>
        <ValidatedCombobox
          name="marketplace"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={laborMarkets.map((lm) => ({ value: lm.address, label: lm.appData?.title ?? "" }))}
        />
      </Field>
    </ValidatedForm>
  );
}

function SubmissionsListView({ submissions, projects }: { submissions: CombinedDoc[]; projects: Project[] }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <SubmissionsTable submissions={submissions} projects={projects} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <SubmissionsCard submissions={submissions} projects={projects} />
      </div>
    </>
  );
}

function SubmissionsTable({ submissions, projects }: { submissions: CombinedDoc[]; projects: Project[] }) {
  const user = useOptionalUser();

  return (
    <Table>
      <Header columns={12} className="mb-2 pt-2 text-sm text-stone-500">
        <Header.Column span={3}>Title</Header.Column>
        <Header.Column span={3}>Challenge</Header.Column>
        <Header.Column span={2}>Chain/Project</Header.Column>
        <Header.Column>Submitted</Header.Column>
      </Header>
      {submissions.map((s) => {
        const score = s.score ? Math.floor(s.score.reviewSum / s.score.reviewCount) : undefined; // TODO average?

        return (
          <Row asChild columns={12} key={`${s.laborMarketAddress}_${s.id}`}>
            <Link
              to={`/app/market/${s.laborMarketAddress}/submission/${s.serviceRequestId}/${s.id}`}
              className={clsx("text-sm text-stone-500", {
                "border-solid border-4 border-sky-500/20": user && user.address === s.configuration.fulfiller,
              })}
            >
              <Row.Column span={3}>
                <div className="flex flex-wrap gap-1">
                  {s.appData?.title}

                  {score !== undefined && <p className="text-neutral-400 font-thin">({score})</p>}
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <img alt="" src="/img/icons/poly.svg" width={15} />
                  <CopyToClipboard
                    className="text-stone-500"
                    content={truncateAddress(s.configuration.fulfiller)}
                    iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                  />
                </div>
              </Row.Column>
              <Row.Column span={3}>{s.sr.appData?.title}</Row.Column>
              <Row.Column span={2}>
                <ProjectBadges projects={findProjectsBySlug(projects, s.sr.appData?.projectSlugs ?? [])} />
              </Row.Column>
              <Row.Column span={2}>{fromNow(submissionCreatedDate(s))}</Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function SubmissionsCard({ submissions, projects }: { submissions: CombinedDoc[]; projects: Project[] }) {
  const user = useOptionalUser();

  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        const averageScore = (s.score?.reviewSum || 0) / (s.score?.reviewCount || 0);

        return (
          <Card asChild key={`${s.laborMarketAddress}_${s.id}`}>
            <Link
              to={`/app/market/${s.laborMarketAddress}/submission/${s.serviceRequestId}/${s.id}`}
              className={clsx("text-sm text-stone-500 grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5", {
                "border-solid border-4 border-sky-500/50": user && user.address === s.configuration.fulfiller,
              })}
            >
              <div className="col-span-2">
                <div className="flex gap-1">
                  {s.appData?.title}
                  <p className="text-neutral-400 font-thin">({averageScore})</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <img alt="" src="/img/icons/poly.svg" width={15} />
                  <CopyToClipboard
                    className="text-stone-500"
                    content={truncateAddress(s.configuration.fulfiller)}
                    iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                  />
                </div>
              </div>
              <p>Challenge</p>
              <p>{s.sr.appData?.title}</p>
              <p>Chain/Project</p>
              <ProjectBadges projects={findProjectsBySlug(projects, s.sr.appData?.projectSlugs ?? [])} />
              <p>Submitted</p>
              {fromNow(submissionCreatedDate(s))}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
