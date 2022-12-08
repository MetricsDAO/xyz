import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import type { Review } from "@prisma/client";
import { Link, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Card } from "~/components/card";
import { Checkbox } from "~/components/checkbox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input/input";
import { Score } from "~/components/score";
import { ValidatedSelect } from "~/components/select";
import { UserBadge } from "~/components/user-badge";
import { SubmissionSearchSchema } from "~/domain/submission";
import { searchSubmissions } from "~/services/submissions.server";
import { fromNow } from "~/utils/date";

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
                  <Score score={averageScore(s.reviews)} />
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
          <Label>Filter:</Label>
          <p>Overall Score</p>
          <Checkbox onChange={handleChange} id="great_checkbox" name="score" value="Great" label="Great" />
          <Checkbox onChange={handleChange} id="good_checkbox" name="score" value="Good" label="Good" />
          <Checkbox onChange={handleChange} id="average_checkbox" name="score" value="Average" label="Average" />
          <Checkbox onChange={handleChange} id="bad_checkbox" name="score" value="Bad" label="Bad" />
          <Checkbox onChange={handleChange} id="spam_checkbox" name="score" value="Spam" label="Spam" />
        </ValidatedForm>
      </aside>
    </section>
  );
}

function averageScore(reviews: Review[]) {
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
