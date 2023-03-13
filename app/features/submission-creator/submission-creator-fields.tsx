import { Button, Field, ValidatedInput, ValidatedTextarea } from "~/components";

export default function SubmissionCreatorFields({ type }: { type: "brainstorm" | "analyze" }) {
  return type === "brainstorm" ? <BrainstormFields /> : <AnalyzeFields />;
}

function BrainstormFields() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="font-bold">Submission Title</h2>
        <Field>
          <ValidatedInput name="title" placeholder="Submission Title" className="w-full" />
        </Field>
      </section>
      <section className="space-y-3">
        <h2 className="font-bold">What would you like Web3 analysts to address?</h2>
        <Field>
          <ValidatedTextarea
            name="description"
            rows={7}
            placeholder="Enter an idea for something Web3 analysts should address. 

      Be specific. Define metrics. Specify time boundaries. Example: How many addresses have transferred SUSHI on Ethereum in the last 90 days?"
          />
        </Field>
        <p className="italic text-gray-500 text-sm">
          Important: You can’t edit this submission after submitting. Double check your work for typos and ensure your
          idea is good to go.{" "}
          <i className="text-blue-600">
            <a href="https://docs.metricsdao.xyz/metricsdao/code-of-conduct#plagiarism-17">
              Plagiarism Code of Conduct.
            </a>
          </i>
        </p>
      </section>
      <Button type="submit">{"transition.state === submitting ? Loading... : Next"}</Button>
    </div>
  );
}

function AnalyzeFields() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="font-bold">Submission Title</h2>
        <Field>
          <ValidatedInput name="title" placeholder="Submission Title" className="w-full" />
        </Field>
      </section>
      <section className="space-y-3">
        <h2 className="font-bold">Public link to your work</h2>
        <Field>
          <ValidatedInput name="description" placeholder="Public link to your work" />
        </Field>
        <p className="italic text-gray-500 text-sm">
          Important: You can’t edit this link after submitting. Double check that this link to work is correct, owned by
          you, published, and public.{" "}
          <i className="text-blue-600">
            <a href="https://docs.metricsdao.xyz/metricsdao/code-of-conduct#plagiarism-17">
              Plagiarism Code of Conduct.
            </a>
          </i>
        </p>
      </section>
      <Button type="submit">Next</Button>
    </div>
  );
}
