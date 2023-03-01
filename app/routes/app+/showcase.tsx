import { DocumentDuplicateIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ValidatedForm } from "remix-validated-form";
import { useRef } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Link, useSubmit } from "@remix-run/react";
import { Checkbox } from "~/components/checkbox";
import { withZod } from "@remix-validated-form/with-zod";
import type { RewardsDoc } from "~/domain";
import { RewardsSearchSchema } from "~/domain";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { fromNow } from "~/utils/date";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
import { Card } from "~/components/card";
import { findProjectsBySlug, truncateAddress } from "~/utils/helpers";
import { Container } from "~/components";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getUser } from "~/services/session.server";
import { getParamsOrFail } from "remix-params-helper";
import { searchSubmissionsWithUpstream } from "~/services/submissions.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { listProjects } from "~/services/projects.server";
import type { Project } from "@prisma/client";
import { ProjectBadges } from "~/features/project-badges";
import { RMetricBadge } from "~/features/rmetric-badge";

const validator = withZod(RewardsSearchSchema);

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await getUser(request);
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, RewardsSearchSchema);
  const submissions = await searchSubmissionsWithUpstream({ ...search });
  const projects = await listProjects();
  return typedjson({
    submissions,
    user,
    search,
    projects,
  });
};

export default function Showcase() {
  const { submissions, user, search, projects } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Showcase</h1>
        <div>
          <p className="text-lg text-sky-500">Discover top brainstorm and analytics submissions across the ecosystem</p>
          <p className="text-gray-500 text-sm">Quickly surface winning submissions from any Marketplace</p>
        </div>
      </section>
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <div className="space-y-3 flex-1">
          <p className="font-semibold">Top Submissions</p>
          <hr className="bg-gray-200" />
          <SubmissionsListView submissions={submissions} projects={projects} />
          <p className="text-md text-stone-500">{"View {count} more"}</p>
        </div>
        <aside className="md:w-1/4 lg:w-1/5 pt-11">
          <SearchAndFilter projects={projects} />
        </aside>
      </section>
    </Container>
  );
}

function SearchAndFilter({ projects }: { projects: Project[] }) {
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

      <h3 className="font-semibold">Filter</h3>
      <Checkbox name="type" label="Analyze" value="analyze" />
      <Checkbox name="type" label="Brainstorm" value="brainstorm" />

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
        <ValidatedCombobox
          name="score"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={[
            { label: "Winners", value: "Winner" },
            { label: "Great", value: "Great" },
            { label: "Good", value: "Good" },
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
            { label: "Past 24 hours", value: "tbd" },
            { label: "Past 7 days", value: "tbd" },
            { label: "Past 30 days", value: "tbd" },
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
          options={[]}
        />
      </Field>
    </ValidatedForm>
  );
}

function SubmissionsListView({ submissions, projects }: { submissions: RewardsDoc[]; projects: Project[] }) {
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

function SubmissionsTable({ submissions, projects }: { submissions: RewardsDoc[]; projects: Project[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2 pt-2 text-sm text-stone-500">
        <Header.Column span={3}>Title</Header.Column>
        <Header.Column span={2}>User rMETRIC</Header.Column>
        <Header.Column span={3}>Challenge</Header.Column>
        <Header.Column span={2}>Chain/Project</Header.Column>
        <Header.Column>Submitted</Header.Column>
      </Header>
      {submissions.map((s) => {
        return (
          <Row asChild columns={12} key={"s.contractId"}>
            <Link
              to={`/app/market/${s.laborMarketAddress}/request/${s.serviceRequestId}`}
              className="text-sm text-stone-500"
            >
              <Row.Column span={3}>
                <div className="flex flex-wrap gap-1">
                  {s.appData?.title}
                  <img alt="" src="/img/trophy.svg" width={15} />
                  <p className="text-neutral-400 font-thin">({"s.score.avg"})</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <img alt="" src="/img/icons/poly.svg" width={15} />
                  <CopyToClipboard
                    className="text-stone-500"
                    content={truncateAddress(s.configuration.serviceProvider)}
                    iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                  />
                </div>
              </Row.Column>
              <Row.Column span={2}>
                <RMetricBadge address={s.configuration.serviceProvider as `0x${string}`} />
              </Row.Column>
              <Row.Column span={3}>{s.sr[0]?.appData?.title}</Row.Column>
              <Row.Column span={2}>
                <ProjectBadges projects={findProjectsBySlug(projects, s.sr[0]?.appData?.projectSlugs ?? [])} />
              </Row.Column>
              <Row.Column span={2}>{fromNow(s.createdAtBlockTimestamp)}</Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function SubmissionsCard({ submissions, projects }: { submissions: RewardsDoc[]; projects: Project[] }) {
  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        return (
          <Card asChild key={"s.contractId"}>
            <Link
              to={`/app/market/${s.laborMarketAddress}/request/${s.serviceRequestId}`}
              className="text-sm text-stone-500 grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
            >
              <div className="col-span-2">
                <div className="flex gap-1">
                  {s.appData?.title}
                  <img alt="" src="/img/trophy.svg" width={15} />
                  <p className="text-neutral-400 font-thin">({"s.score.avg"})</p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <img alt="" src="/img/icons/poly.svg" width={15} />
                  <CopyToClipboard
                    className="text-stone-500"
                    content={truncateAddress(s.configuration.serviceProvider)}
                    iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                  />
                </div>
              </div>
              <p>User rMETRIC</p>
              <RMetricBadge address={s.configuration.serviceProvider as `0x${string}`} />
              <p>Challenge</p>
              <p>{s.sr[0]?.appData?.title}</p>
              <p>Chain/Project</p>
              <ProjectBadges projects={findProjectsBySlug(projects, s.sr[0]?.appData?.projectSlugs ?? [])} />
              <p>Submitted</p>
              {fromNow(s.createdAtBlockTimestamp)}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
