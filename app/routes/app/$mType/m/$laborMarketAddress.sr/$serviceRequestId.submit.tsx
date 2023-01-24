import { useParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { typedjson, useTypedActionData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Button, Container, Field, Modal, ValidatedInput, ValidatedTextarea } from "~/components";
import type { SubmissionContract } from "~/domain/submission";
import { SubmissionFormSchema } from "~/domain/submission";
import { useCreateSubmission } from "~/hooks/use-create-submission";
import { findServiceRequest } from "~/services/service-request.server";
import { prepareSubmission } from "~/services/submissions.server";
import { isValidationError } from "~/utils/utils";

const validator = withZod(SubmissionFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });

type ActionResponse = { preparedSubmission: SubmissionContract } | ValidationErrorResponseData;
export const action = async ({ request, params }: ActionArgs) => {
  const { serviceRequestId, laborMarketAddress } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  invariant(serviceRequest, "service request must exist");

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedSubmission = await prepareSubmission(serviceRequest, result.data);
  return typedjson({ preparedSubmission });
};

export default function SubmitQuestion() {
  const actionData = useTypedActionData<ActionResponse>();
  const [modalData, setModalData] = useState<{ data?: SubmissionContract; isOpen: boolean }>({
    isOpen: false,
  });
  const { mType } = useParams();

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      setModalData({ data: actionData.preparedSubmission, isOpen: true });
    }
  }, [actionData]);

  if (mType === "analyze") {
    return <Analyze modalData={modalData} closeModal={closeModal} />;
  } else if (mType === "brainstorm") {
    return <Brainstorm modalData={modalData} closeModal={closeModal} />;
  } else {
    console.error("mtype is neither brainstorm nor analyze");
  }
}

function Brainstorm({
  modalData,
  closeModal,
}: {
  modalData: { data?: SubmissionContract; isOpen: boolean };
  closeModal: () => void;
}) {
  return (
    <Container className="py-16 mx-auto`">
      <div className="flex flex-col-reverse justify-center lg:flex-row  space-y-reverse space-y-8 lg:space-y-0 lg:space-x-16">
        <main className="lg:max-w-xl space-y-7">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Submit Your Idea</h1>
            <h2 className="text-lg text-cyan-500">What would you like Web3 analysts to address?</h2>
            <p className="text-gray-500 text-sm">
              Submit your idea. Peer reviewers will score your submission. If you’re a winner, you’ll earn tokens and
              rMETRIC from the challenge reward pool!
            </p>
          </div>
          <ValidatedForm method="post" validator={validator}>
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
                  Important: You can’t edit this submission after submitting. Double check your work for typos and
                  ensure your idea is good to go.{" "}
                  <i className="text-blue-600">
                    <a href="https://docs.metricsdao.xyz/metricsdao/code-of-conduct#plagiarism-17">
                      Plagiarism Code of Conduct.
                    </a>
                  </i>
                </p>
              </section>
              <Button type="submit">Next</Button>
            </div>
          </ValidatedForm>
          <Modal title="Launch Challenge?" isOpen={modalData.isOpen} onClose={closeModal}>
            <ConfirmTransaction data={modalData.data} onClose={closeModal} type="Idea" />
          </Modal>
        </main>
        <aside className="lg:basis-1/3 ">
          <div className="rounded-lg border-2 p-5 bg-blue-300 bg-opacity-5 space-y-6 text-sm">
            <p className="font-bold">Be specific:</p>
            <div className="text-gray-500 space-y-3">
              <p>"How many people actively use Sushi?"</p>
              <p>
                The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
                talking Ethereum? What about Polygon?
              </p>
              <p className="font-medium italic">
                UPDATE: How many addresses actively use the SUSHI token on Ethereum?{" "}
              </p>
            </div>
            <p className="font-bold">Define metrics:</p>
            <div className="text-gray-500 space-y-3">
              <p>
                What is “active“? What is “use”? These terms can (and will) mean different things to different people.
                It doesn't matter what definition you use as long as you communicate your expectations. Alternatively,
                you can ask for the metric to be defined as part of the question.
              </p>
              <p className="font-medium italic">UPDATE: How many addresses have transferred SUSHI on Ethereum?</p>
            </div>
            <div className="space-y-3">
              <p className="font-bold">Specify time boundaries:</p>
              <div className="text-gray-500 space-y-3">
                <p>
                  We still haven't fully defined “active”. Specifying time makes the result easier to understand, don't
                  rely on the person answering the question to specify time for you if you didn’t ask them to.
                </p>
                <p className="font-medium italic">
                  UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function Analyze({
  modalData,
  closeModal,
}: {
  modalData: { data?: SubmissionContract; isOpen: boolean };
  closeModal: () => void;
}) {
  return (
    <Container className="py-16 mx-auto`">
      <div className="flex flex-col-reverse justify-center lg:flex-row  space-y-reverse space-y-8 lg:space-y-0 lg:space-x-16">
        <main className="lg:max-w-xl space-y-7">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Submit Your Work</h1>
            <h2 className="text-lg text-cyan-500">Provide a public link to your work.</h2>
            <p className="text-gray-500 text-sm">
              Submit your work. Peers will review and score your submission. If you’re a winner, you’ll earn tokens and
              rMETRIC from the challenge reward pool!
            </p>
          </div>
          <ValidatedForm method="post" validator={validator}>
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
                  Important: You can’t edit this link after submitting. Double check that this link to work is correct,
                  owned by you, published, and public.{" "}
                  <i className="text-blue-600">
                    <a href="https://docs.metricsdao.xyz/metricsdao/code-of-conduct#plagiarism-17">
                      Plagiarism Code of Conduct.
                    </a>
                  </i>
                </p>
              </section>
              <Button type="submit">Next</Button>
            </div>
          </ValidatedForm>
          <Modal title="Submit Work" isOpen={modalData.isOpen} onClose={closeModal}>
            <ConfirmTransaction data={modalData.data} onClose={closeModal} type="Work" />
          </Modal>
        </main>
        <aside className="lg:basis-1/3 ">
          <div className="rounded-lg border-2 p-5 bg-blue-300 bg-opacity-5 space-y-6 text-sm">
            <div className="space-y-1">
              <p className="font-bold">Analyst tools and resources:</p>
              <a
                href="https://docs.metricsdao.xyz/analyst-resources/resources"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                MetricsDAO Docs
              </a>
              <a href="https://blog.metricsdao.xyz/" target="_blank" rel="noreferrer" className="block text-blue-500">
                MetricsDAO Blog
              </a>
            </div>
            <div className="space-y-1">
              <p className="font-bold">How to make stuff that lasts:</p>
              <a
                href="https://blog.metricsdao.xyz/make-stuff-that-lasts/"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                Make Stuff That Lasts
              </a>
            </div>
            <div className="space-y-1">
              <p className="font-bold">Examples of best submissions:</p>
              <a
                href="https://blog.metricsdao.xyz/tag/best-submissions/"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                Best Submissions
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function ConfirmTransaction({ data, onClose, type }: { data?: SubmissionContract; onClose: () => void; type: string }) {
  invariant(data, "data is required"); // this should never happen but just in case

  const { write, isLoading } = useCreateSubmission({
    data,
    onTransactionSuccess() {
      toast.dismiss("submission-create");
      toast.success("Submission sent!");
      onClose();
    },
    onWriteSuccess() {
      toast.loading("Submitting...", { id: "submission-create" });
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <div className="space-y-8">
      <p>Please confirm that you would like to make this submission.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onCreate} loading={isLoading}>
          Submit {type}
        </Button>
        <Button variant="cancel" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}