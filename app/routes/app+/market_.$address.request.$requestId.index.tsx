import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson } from "remix-typedjson";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Checkbox } from "~/components/checkbox";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input/input";
import { ValidatedSelect } from "~/components/select";
import { EvmAddressSchema } from "~/domain/address";
import { SubmissionSearchSchema } from "~/domain/submission/schemas";
import { SubmissionCard } from "~/features/submission-card";
import { countSubmissions, searchSubmissionsWithReviews } from "~/domain/submission/functions.server";
import { Pagination } from "~/components/pagination";

const validator = withZod(SubmissionSearchSchema);

const paramSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address, requestId } = getParamsOrFail(params, paramSchema);
  const url = new URL(request.url);
  const searchParams = getParamsOrFail(url.searchParams, SubmissionSearchSchema);
  const filterAndSearchParams = { ...searchParams, laborMarketAddress: address, serviceRequestId: requestId };
  const submissions = await searchSubmissionsWithReviews(filterAndSearchParams);
  const totalSubmissions = await countSubmissions(filterAndSearchParams);
  return typedjson({ submissions, searchParams, totalSubmissions });
};

export type ChallengeSubmissonProps = {
  submissions: UseDataFunctionReturn<typeof loader>["submissions"];
};

export default function ChallengeIdSubmissions() {
  const { submissions, searchParams, totalSubmissions } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true, preventScrollReset: true });
    }
  };

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      <main className="min-w-[300px] w-full space-y-4">
        {submissions?.map((s) => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
        <div className="w-fit m-auto">
          <Pagination page={searchParams.page} totalPages={Math.ceil(totalSubmissions / searchParams.first)} />
        </div>
      </main>

      <aside className="md:w-1/4 text-sm">
        <ValidatedForm
          formRef={formRef}
          method="get"
          validator={validator}
          onChange={handleChange}
          preventScrollReset={true}
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
                { label: "Title", value: "appData.title" },
                { label: "Created At", value: "createdAtBlockTimestamp" },
              ]}
            />
          </Field>
          <Label>Filter:</Label>
          <p>Overall Score</p>
          <Checkbox onChange={handleChange} id="stellar_checkbox" name="score" value="stellar" label="Stellar" />
          <Checkbox onChange={handleChange} id="good_checkbox" name="score" value="good" label="Good" />
          <Checkbox onChange={handleChange} id="average_checkbox" name="score" value="average" label="Average" />
          <Checkbox onChange={handleChange} id="bad_checkbox" name="score" value="bad" label="Bad" />
          <Checkbox onChange={handleChange} id="spam_checkbox" name="score" value="spam" label="Spam" />
        </ValidatedForm>
      </aside>
    </section>
  );
}
