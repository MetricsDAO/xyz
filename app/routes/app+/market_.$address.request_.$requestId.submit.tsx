import type { DataFunctionArgs } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Container } from "~/components";
import type { SubmissionContract } from "~/domain/submission";
import { SubmissionFormSchema } from "~/domain/submission";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { findServiceRequest } from "~/services/service-request.server";
import { getUser } from "~/services/session.server";
import { prepareSubmission } from "~/services/submissions.server";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import SubmissionCreator from "~/features/submission-creator/submission-creator";

const validator = withZod(SubmissionFormSchema);
const paramsSchema = z.object({ address: z.string(), requestId: z.string() });
const submissionMachine = createBlockchainTransactionStateMachine<SubmissionContract>();

type ActionResponse = { preparedSubmission: SubmissionContract } | ValidationErrorResponseData;
export const action = async ({ request, params }: ActionArgs) => {
  const user = await getUser(request);
  invariant(user, "You must be logged in to create a marketplace");

  const { requestId, address } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  invariant(serviceRequest, "service request must exist");

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedSubmission = await prepareSubmission(user, address, requestId, result.data);
  return typedjson({ preparedSubmission });
};

export const loader = async ({ params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  const laborMarket = await getIndexedLaborMarket(address);
  invariant(laborMarket, "labormarket must exist");

  return typedjson({ laborMarket }, { status: 200 });
};

export default function SubmitQuestion() {
  const { laborMarket } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  if (laborMarket.appData?.type === "analyze") {
    return <Analyze />;
  } else if (laborMarket.appData?.type === "brainstorm") {
    return <Brainstorm />;
  } else {
    console.error("mtype is neither brainstorm nor analyze");
  }
}

function Brainstorm() {
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
          <SubmissionCreator />
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

function Analyze() {
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
          <SubmissionCreator />
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
