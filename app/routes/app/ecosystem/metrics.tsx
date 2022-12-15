import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ValidatedForm } from "remix-validated-form";
import { useRef } from "react";
import { ValidatedCombobox } from "~/components/combobox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input";
import { useSubmit } from "@remix-run/react";
import { Checkbox } from "~/components/checkbox";
import { withZod } from "@remix-validated-form/with-zod";
import { LaborMarketSearchSchema } from "~/domain";
import { ValidatedSelect } from "~/components/select";

//change
const validator = withZod(LaborMarketSearchSchema);

export default function Metrics() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1 space-y-10">
        <div className="space-y-5">
          <p className="font-semibold text-md">Activity</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mx-auto items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto items-center">
            <StatsCard figure={"64,000"} title="Total participants" />
            <StatsCard figure={"23,000"} title="Analysts" />
            <StatsCard figure={"52,000"} title="Reviewers" />
          </div>
          <div className="bg-stone-200 rounded-md w-full h-44 border flex items-center">
            <p className="py-20 mx-auto">Totally a chart</p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="font-semibold text-md">Rewards</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mx-auto items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto items-center">
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
  if (typeof figure === "number") {
    figure = figure.toLocaleString();
  }

  return (
    <div className="flex flex-col gap-1 items-center border bg-blue-300/[.05] rounded-lg w-full h-full py-16 px-3">
      <div className="flex">
        {icon}
        <p className="text-sky-500 text-3xl text-center">{figure}</p>
      </div>
      <p className="text-stone-500 text-lg text-center">{title}</p>
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
