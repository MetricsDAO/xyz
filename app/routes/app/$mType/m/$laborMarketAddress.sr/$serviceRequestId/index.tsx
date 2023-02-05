import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Checkbox } from "~/components/checkbox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input/input";
import { ValidatedSelect } from "~/components/select";
import type { SubmissionSearch } from "~/domain/submission";
import { SubmissionContract, SubmissionSearchSchema } from "~/domain/submission";
import { SubmissionCard } from "~/features/submission-card";
import { searchSubmissions } from "~/services/submissions.server";

const validator = withZod(SubmissionSearchSchema);

export const loader = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.serviceRequestId, "id is required");
  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, SubmissionSearchSchema);
  const submissions = await searchSubmissions({ ...search, serviceRequestId: params.serviceRequestId });
  console.log("Submissions", submissions);
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
        {/* {submissions.map((s) => {
          return <SubmissionCard key={s._id} submission={s} totalReviews={s.reviews.length} />;
        })} */}
      </main>

      <aside className="md:w-1/4 text-sm">
        <ValidatedForm
          formRef={formRef}
          method="get"
          validator={validator}
          onChange={handleChange}
          className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-blue-300 bg-opacity-5 rounded-lg p-4"
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
