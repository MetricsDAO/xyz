import { Form, Link } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Author } from "~/components/Author";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/checkbox/checkbox";
import { Countdown } from "~/components/countdown";
import { Input } from "~/components/input/input";
import { Score } from "~/components/Score";
import { Select } from "~/components/Select";
import { SubmissionSearchSchema } from "~/domain/submission";
import { searchSubmissions } from "~/services/submissions.server";
import invariant from "tiny-invariant";

export const loader = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.id, "id is required");
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, SubmissionSearchSchema);
  const submissions = await searchSubmissions({ ...search, serviceRequestId: params.id });
  return typedjson({ submissions });
};

export default function ChallengeIdSubmissions() {
  const { submissions } = useTypedLoaderData<typeof loader>();
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      <main className="min-w-[300px] w-full space-y-4">
        {submissions.map((s) => {
          return (
            <Card asChild key={s.id}>
              <Link
                to={`/app/brainstorm/s/${s.id}`}
                className="flex flex-col md:flex-row text-sm p-6 items-center space-x-4"
              >
                <main className="space-y-2 flex-1">
                  <h4 className="font-medium text-gray-900">{s.title}</h4>
                  <section className="text-gray-900">{s.description}</section>
                  <div className="flex space-x-1 items-center text-xs">
                    <Countdown date={s.createdAt} /> by <Author />
                  </div>
                </main>
                <div className="space-y-3">
                  <Score score={50} />
                  <p className="text-xs text-gray-500 text-center">55 reviews</p>
                </div>
              </Link>
            </Card>
          );
        })}
      </main>

      <aside className="md:w-1/4 text-sm">
        <Form className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-brand-400 bg-opacity-5 rounded-lg p-4">
          <Input placeholder="Search" size="sm" name="search" />
          <Select label="Sort" name="sortBy" size="sm" options={[{ label: "Chain/Project", value: "project" }]} />
          <Checkbox name="filters" value="winners" label="Winners Only" />
          <Checkbox name="filters" value="great" label="Great" />
          <Checkbox name="filters" value="good" label="Good" />
          <Checkbox name="filters" value="average" label="Average" />
          <Checkbox name="filters" value="bad" label="Bad" />
        </Form>
      </aside>
    </section>
  );
}
