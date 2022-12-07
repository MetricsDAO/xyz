import { ClipboardDocumentIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ValidatedForm } from "remix-validated-form";
import { Container } from "~/components/Container";
import { useRef } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { Link, useSubmit } from "@remix-run/react";
import { Checkbox } from "~/components/checkbox";
import { withZod } from "@remix-validated-form/with-zod";
import { LaborMarketSearchSchema } from "~/domain";
import { Button } from "~/components/button";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { ProjectAvatar, TokenAvatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";
import { fromNow } from "~/utils/date";
import { CopyToClipboard } from "~/components/copy-to-clipboard";

//change
const validator = withZod(LaborMarketSearchSchema);

export default function Ecosystem() {
  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Ecosystem</h1>
        <div>
          <p className="text-lg text-sky-500">
            Discover top submissions, rMETRIC holders, participants, and ecosystem metrics
          </p>
          <p className="text-gray-500 text-md">Quickly surface relevant challenge activity and metrics over time</p>
        </div>
        <div className="space-x-3 pt-5">
          <Button size="sm">Showcase</Button>
          <Button size="sm">Metrics</Button>
        </div>
      </section>
      <Showcase />
    </Container>
  );
}

function StatsCard({
  figure,
  title,
  description,
  icon,
}: {
  figure: string | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 items-center border bg-blue-300/[.05] rounded-lg w-full h-full py-16 px-3">
      <div className="flex">
        {icon}
        <p className="text-sky-500 text-3xl">{figure}</p>
      </div>
      <p className="text-stone-500 text-lg">{title}</p>
      <p className="text-neutral-400 text-md text-center">{description}</p>
    </div>
  );
}

function SearchAndFilter() {
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
      <Checkbox name="flow" label="Analyze" value="analyze" />
      <Checkbox name="flow" label="Brainstorm" value="brainstorm" />

      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox name="token" onChange={handleChange} placeholder="Select option" size="sm" options={[]} />
      </Field>

      <Field>
        <Label>Timeframe</Label>
        <ValidatedSelect name="project" size="sm" onChange={handleChange} placeholder="Select option" options={[]} />
      </Field>
    </ValidatedForm>
  );
}

function Showcase() {
  const submissions = [
    { id: "23123", title: "ew", createdAt: "11-11-2021", serviceRequest: { title: "This is a challenge" }, score: 22 },
  ];

  const w = { address: "0x364875845389cl1hny43i8" };
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1 space-y-10">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top Submissions</p>
          <hr className="h-1 bg-gray-200" />
          <Table>
            <Header columns={12} className="mb-2 pt-2">
              <Header.Column span={3}>Title</Header.Column>
              <Header.Column span={2}>User rMETRIC</Header.Column>
              <Header.Column span={3}>Challenge</Header.Column>
              <Header.Column span={2}>Chain/Project</Header.Column>
              <Header.Column>Submitted</Header.Column>
            </Header>
            {submissions.map((s) => {
              return (
                <Row asChild columns={12} key={s.id}>
                  <Link to={`/app/brainstorm/c/${s.id}`} className="text-sm text-stone-500">
                    <Row.Column span={3}>
                      <div className="flex gap-1">
                        {s.title}
                        <img alt="" src="/img/trophy.svg" width={15} />
                        <p className="text-neutral-400 font-thin">({s.score})</p>
                      </div>
                      <div className="flex flex-row items-center gap-x-2">
                        <img alt="" src="/img/icons/poly.svg" width={15} />
                        <CopyToClipboard
                          className="text-stone-500"
                          content={
                            w.address.length > 10 ? w.address?.slice(0, 6) + "..." + w.address?.slice(-4) : w.address
                          }
                          iconRight={<ClipboardDocumentIcon />}
                        />
                      </div>
                    </Row.Column>
                    <Row.Column span={2}>
                      <Badge>400 rMETRIC</Badge>
                    </Row.Column>
                    <Row.Column span={3}>{s.serviceRequest.title}</Row.Column>
                    <Row.Column span={2}>
                      {/*<div className="flex items-center gap-2 flex-wrap">
                  {m.projects.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectAvatar project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                  </div>*/}
                    </Row.Column>
                    <Row.Column span={2}>{fromNow(s.createdAt)}</Row.Column>
                  </Link>
                </Row>
              );
            })}
          </Table>

          <p>{"View {count} more"}</p>
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top rMETRIC holders</p>
          <hr className="h-1 bg-gray-200" />
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
          <Table>
            <Header columns={6} className="mb-2 pt-2">
              <Header.Column span={4}>Address</Header.Column>
              <Header.Column>% of Supply</Header.Column>
              <Header.Column>Balance</Header.Column>
            </Header>
            {submissions.map((s) => {
              return (
                <Row asChild columns={6} key={s.id}>
                  <Link to={`/app/brainstorm/c/${s.id}`} className="text-sm font-medium text-stone-500">
                    <Row.Column span={4} className="flex flex-row items-center gap-x-2">
                      <img alt="" src="/img/icons/poly.svg" />
                      <CopyToClipboard
                        className="text-stone-500"
                        content={"0x87568375647367398674839834678"}
                        iconRight={<ClipboardDocumentIcon className="ml-0.5" />}
                      />
                    </Row.Column>
                    <Row.Column>11.82%</Row.Column>
                    <Row.Column>
                      <Badge>400 rMETRIC</Badge>
                    </Row.Column>
                  </Link>
                </Row>
              );
            })}
          </Table>

          <p>{"View {count} more"}</p>
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold">Top Particpants</p>
          <hr className="h-1 bg-gray-200" />
          <div className="flex gap-5">
            <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
              <p className="py-20 mx-auto">Totally a chart</p>
            </div>
            <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
              <p className="py-20 mx-auto">Totally a chart</p>
            </div>
          </div>
          <Table>
            <Header columns={12} className="mb-2 pt-2">
              <Header.Column span={4}>Address</Header.Column>
              <Header.Column span={2}>rMETRIC</Header.Column>
              <Header.Column span={2}>Challenges Launched</Header.Column>
              <Header.Column span={2}>Challenges Won</Header.Column>
              <Header.Column>Tokens Funded</Header.Column>
              <Header.Column>Tokens Claimed</Header.Column>
            </Header>
            {submissions.map((s) => {
              return (
                <Row asChild columns={12} key={s.id}>
                  <Link to={`/app/brainstorm/c/${s.id}`} className="text-sm font-medium text-stone-500">
                    <Row.Column span={4} className="flex flex-row items-center gap-x-2">
                      <img alt="" src="/img/icons/poly.svg" />
                      <CopyToClipboard
                        className="text-stone-500"
                        content={
                          w.address.length > 10 ? w.address?.slice(0, 6) + "..." + w.address?.slice(-4) : w.address
                        }
                        iconRight={<ClipboardDocumentIcon className="ml-0.5" />}
                      />
                    </Row.Column>
                    <Row.Column span={2}>
                      <Badge>400 rMETRIC</Badge>
                    </Row.Column>
                    <Row.Column span={2} className="text-center">
                      70
                    </Row.Column>
                    <Row.Column span={2} className="text-center">
                      22
                    </Row.Column>
                    <Row.Column span={2} className="flex gap-1 items-center">
                      <img src="/img/icons/dollar.svg" alt="" />
                      73248
                    </Row.Column>
                    <Row.Column span={2} className="flex gap-1 items-center">
                      <img src="/img/icons/dollar.svg" alt="" />
                      73248
                    </Row.Column>
                  </Link>
                </Row>
              );
            })}
          </Table>

          <p>{"View {count} more"}</p>
        </div>
      </main>
      <aside className="md:w-1/4 lg:w-1/5 pt-11">
        <ShowcaseSearchAndFilter />
      </aside>
    </section>
  );
}

function ShowcaseSearchAndFilter() {
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
      <Checkbox name="flow" label="Analyze" value="analyze" />
      <Checkbox name="flow" label="Brainstorm" value="brainstorm" />

      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox name="project" onChange={handleChange} placeholder="Select option" size="sm" options={[]} />
      </Field>

      <Field>
        <Label>Score</Label>
        <ValidatedCombobox name="score" size="sm" onChange={handleChange} placeholder="Select option" options={[]} />
      </Field>

      <Field>
        <Label>Timeframe</Label>
        <ValidatedSelect name="timeframe" size="sm" onChange={handleChange} placeholder="Select option" options={[]} />
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

function Metrics() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1 space-y-10">
        <div className="space-y-5">
          <p className="font-semibold text-md">Activity</p>
          <div className="flex gap-5 mx-auto items-center">
            <StatsCard figure={87} title="Marketplaces" />
            <StatsCard figure={2000} title="Challenges" />
            <StatsCard figure={50000} title="Submissions" />
            <StatsCard figure={175000} title="Reviews" />
          </div>
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="font-semibold text-md">Participants</p>
          <div className="flex gap-5 mx-auto items-center">
            <StatsCard figure={64000} title="Total participants" />
            <StatsCard figure={23000} title="Analysts" />
            <StatsCard figure={52000} title="Reviewers" />
          </div>
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="font-semibold text-md">Rewards</p>
          <div className="flex gap-5 mx-auto items-center">
            <StatsCard
              figure={64000}
              title="Total Tokens Funded"
              description="USD value of tokens funded across all challenges"
              icon={<img alt="" src="/img/icons/dollar.svg" className="mr-2" />}
            />
            <StatsCard
              figure={23000}
              title="Total Tokens Claimed"
              description="USD value of tokens claimed across all challenges"
              icon={<img alt="" src="/img/icons/dollar.svg" className="mr-2" />}
            />
          </div>
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="font-semibold text-md">Reputation</p>
          <div className="flex gap-5 mx-auto items-center">
            <StatsCard
              figure={64000}
              title="Total rMETRIC Issued"
              description="Challenge winners and positive contributors earn rMETRIC"
            />
            <StatsCard
              figure={23000}
              title="Total rMETRIC Slashed"
              description="Participants who don’t honor commitments on claimed challenges lose rMETRIC"
            />
            <StatsCard
              figure="-50% every 90d"
              title="Reputation Rate of Decay"
              description="Ongoing decay ensures reputation scores represent recent contributions"
            />
          </div>
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
        </div>
      </main>
      <aside className="md:w-1/4 lg:w-1/5 pt-11">
        <SearchAndFilter />
      </aside>
    </section>
  );
}
