import { Link, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { UserBadge } from "~/components/UserBadge";
import { Card } from "~/components/Card";
import { ValidatedForm } from "remix-validated-form";
import { Checkbox } from "~/components/checkbox";
import { ValidatedInput } from "~/components/input/input";
import { Score } from "~/components/Score";
import { ValidatedSelect } from "~/components/select";
import { SubmissionSearchSchema } from "~/domain/submission";
import { searchSubmissions } from "~/services/submissions.server";
import invariant from "tiny-invariant";
import { useRef } from "react";
import { Field, Label } from "~/components/field";
import { withZod } from "@remix-validated-form/with-zod";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { fromNow } from "~/utils/date";
import { Review } from "@prisma/client";

const validator = withZod(SubmissionSearchSchema);

export const loader = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.id, "id is required");
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, SubmissionSearchSchema);
  const submissions = await searchSubmissions({ ...search, serviceRequestId: params.id });
  return typedjson({ submissions });
};

export default function ChallengeIdSubmissions() {
  const { submissions } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

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
                    {fromNow(s.createdAt)} by <UserBadge url="u/id" name={"jo.Eth"} balance={200} />
                  </div>
                </main>
                <div className="space-y-3">
                  <Score score={scoreMath(s.reviews)} />
                  <p className="text-xs text-gray-500 text-center">{s.reviews.length} reviews</p>
                </div>
              </Link>
            </Card>
          );
        })}
      </main>

      <aside className="md:w-1/4 text-sm">
        <ValidatedForm
          formRef={formRef}
          method="get"
          validator={validator}
          onChange={handleChange}
          className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-brand-400 bg-opacity-5 rounded-lg p-4"
        >
          <ValidatedInput
            placeholder="Search"
            size="sm"
            name="q"
            iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
          />
          <Field>
            <Label>Sort:</Label>
            <ValidatedSelect
              name="sortBy"
              size="sm"
              onChange={handleChange}
              options={[
                { label: "Title", value: "title" },
                { label: "Description", value: "description" },
                { label: "Author", value: "creatorId" },
                { label: "Created At", value: "createdAt" },
                { label: "# Reviews", value: "reviews" },
              ]}
            />
          </Field>
          <Checkbox name="filters" value="winners" label="Winners Only" />
          <Checkbox name="filters" value="great" label="Great" />
          <Checkbox name="filters" value="good" label="Good" />
          <Checkbox name="filters" value="average" label="Average" />
          <Checkbox name="filters" value="bad" label="Bad" />
        </ValidatedForm>
      </aside>
    </section>
  );
}

function scoreMath(reviews: Review[]) {
  const score = reviews.reduce((sum, r) => sum + numScore(r.scoreStatus), 0);
  return score / reviews.length;
}

function numScore(status: string) {
  switch (status) {
    case "Great":
      return 100;
    case "Good":
      return 75;
    case "Average":
      return 50;
    case "Bad":
      return 25;
    default:
      return 0;
  }
}
