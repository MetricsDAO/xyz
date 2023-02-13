import { useParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { typedjson, useTypedActionData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Button, Container, Field, Modal, ValidatedInput, ValidatedTextarea } from "~/components";
import type { SubmissionContract } from "~/domain/submission";
import { SubmissionFormSchema } from "~/domain/submission";
import { RPCError } from "~/features/rpc-error";
import { CreateSubmissionWeb3Button } from "~/features/web3-button/create-submission";
import type { EthersError, SendTransactionResult } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { findServiceRequest } from "~/services/service-request.server";
import { getUser } from "~/services/session.server";
import { prepareSubmission } from "~/services/submissions.server";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";

const validator = withZod(SubmissionFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
const submissionMachine = createBlockchainTransactionStateMachine<SubmissionContract>();

type ActionResponse = { preparedSubmission: SubmissionContract } | ValidationErrorResponseData;
export const action = async ({ request, params }: ActionArgs) => {
  const user = await getUser(request);
  invariant(user, "You must be logged in to create a marketplace");

  const { serviceRequestId, laborMarketAddress } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  invariant(serviceRequest, "service request must exist");

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedSubmission = await prepareSubmission(user, laborMarketAddress, serviceRequestId, result.data);
  return typedjson({ preparedSubmission });
};

export default function SubmitQuestion() {
  const actionData = useTypedActionData<ActionResponse>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { mType } = useParams();
  const [state, send] = useMachine(submissionMachine, {
    actions: {
      notifyTransactionWait: (context) => {
        defaultNotifyTransactionActions.notifyTransactionWait(context);
      },
      notifyTransactionSuccess: (context) => {
        defaultNotifyTransactionActions.notifyTransactionSuccess(context);
      },
      notifyTransactionFailure: () => {
        defaultNotifyTransactionActions.notifyTransactionFailure();
      },
    },
  });

  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      send({ type: "RESET_TRANSACTION" });
      send({
        type: "PREPARE_TRANSACTION_READY",
        data: actionData.preparedSubmission,
      });
      setIsModalOpen(true);
    }
  }, [actionData, send]);

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (mType === "analyze") {
    return (
      <Analyze
        isModalOpen={isModalOpen && !state.matches("transactionWait")}
        closeModal={closeModal}
        contractData={state.context.contractData}
        onWriteSuccess={onWriteSuccess}
      />
    );
  } else if (mType === "brainstorm") {
    return (
      <Brainstorm
        isModalOpen={isModalOpen && !state.matches("transactionWait")}
        closeModal={closeModal}
        contractData={state.context.contractData}
        onWriteSuccess={onWriteSuccess}
      />
    );
  } else {
    console.error("mtype is neither brainstorm nor analyze");
  }
}

function Brainstorm({
  isModalOpen,
  closeModal,
  contractData,
  onWriteSuccess,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  contractData: SubmissionContract | undefined;
  onWriteSuccess: ((result: SendTransactionResult) => void) | undefined;
}) {
  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };
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
          {contractData && (
            <Modal title="Submit Idea" isOpen={isModalOpen} onClose={closeModal}>
              <div className="space-y-8">
                <p>Please confirm that you would like to submit this idea.</p>
                {error && <RPCError error={error} />}
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                  {!error && (
                    <CreateSubmissionWeb3Button
                      data={contractData}
                      onWriteSuccess={onWriteSuccess}
                      onPrepareTransactionError={onPrepareTransactionError}
                    />
                  )}
                  <Button variant="cancel" size="md" onClick={closeModal} fullWidth>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          )}
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
  isModalOpen,
  closeModal,
  contractData,
  onWriteSuccess,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  contractData: SubmissionContract | undefined;
  onWriteSuccess: ((result: SendTransactionResult) => void) | undefined;
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
          {contractData && (
            <Modal title="Submit Work" isOpen={isModalOpen} onClose={closeModal}>
              <div className="space-y-8">
                <p>Please confirm that you would like to submit this work.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                  <CreateSubmissionWeb3Button data={contractData} onWriteSuccess={onWriteSuccess} />
                  <Button variant="cancel" size="md" onClick={closeModal} fullWidth>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          )}
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
