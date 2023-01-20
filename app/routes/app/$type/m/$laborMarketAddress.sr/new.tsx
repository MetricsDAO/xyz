import { useParams } from "@remix-run/react";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import {
  Container,
  Modal,
  Error,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
  Button,
  Field,
} from "~/components";
import type { ServiceRequestContract } from "~/domain";
import { ServiceRequestFormSchema, fakeServiceRequestFormData } from "~/domain";
import { useApproveERC20 } from "~/hooks/use-approve-erc20";
import { useCreateServiceRequest } from "~/hooks/use-create-service-request";
import { prepareServiceRequest } from "~/services/service-request.server";

const validator = withZod(ServiceRequestFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string() });

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;
  return typedjson({ defaultValues });
};

type ActionResponse = { preparedServiceRequest: ServiceRequestContract } | ValidationErrorResponseData;
export const action = async ({ request, params }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  const { laborMarketAddress } = paramsSchema.parse(params);
  if (result.error) return validationError(result.error);

  const preparedServiceRequest = await prepareServiceRequest(laborMarketAddress, result.data);
  return typedjson({ preparedServiceRequest });
};

export default function CreateServiceRequest() {
  const { defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const { type } = useParams();

  const [modalData, setModalData] = useState<{ serviceRequest?: ServiceRequestContract; isOpen: boolean }>({
    isOpen: false,
  });

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && "preparedServiceRequest" in actionData) {
      setModalData({ serviceRequest: actionData.preparedServiceRequest, isOpen: true });
    }
  }, [actionData]);

  return (
    <Container className="max-w-3xl my-10 space-y-10">
      {type === "brainstorm" ? <BrainstormHeader /> : <AnalyticsHeader />}

      <ValidatedForm
        method="post"
        defaultValues={{
          language: "english",
          ...defaultValues,
        }}
        validator={validator}
        className="space-y-10"
      >
        <section className="space-y-3">
          <h2 className="font-bold">Challenge Title</h2>
          <Field>
            <ValidatedInput name="title" placeholder="Challenge Title" className="w-full" />
            <Error name="title" />
          </Field>
        </section>
        <section className="space-y-3">
          {type === "brainstorm" ? <BrainstormInput /> : <AnalyticsInput />}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <Field>
                <ValidatedSelect
                  name="language"
                  placeholder="Language"
                  options={[{ label: "English", value: "english" }]}
                />
                <Error name="language" />
              </Field>
            </div>
            <div className="flex-grow">
              <Field>
                <ValidatedSelect
                  name="projects"
                  placeholder="Blockchain/Project(s)"
                  options={[
                    { label: "Ethereum", value: "ethereum" },
                    { label: "Solana", value: "solana" },
                  ]}
                />
                <Error name="projects" />
              </Field>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When will submissions be accepted</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <p>Start</p>
              <Field>
                <ValidatedInput type="date" name="startDate" placeholder="Start date" />
                <Error name="startDate" />
              </Field>
              <Field>
                <ValidatedInput type="time" name="startTime" placeholder="Start time" />
                <Error name="startTime" />
              </Field>
            </div>
            <div className="flex-grow">
              <p>End</p>
              <Field>
                <ValidatedInput type="date" name="endDate" placeholder="End date" />
                <Error name="endDate" />
              </Field>
              <Field>
                <ValidatedInput type="time" name="endTime" placeholder="End time" />
                <Error name="endTime" />
              </Field>
            </div>
          </div>
          <p className="text-gray-400 italic">
            Authors must claim this topic by (local timestamp) to submit question ideas
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When must peer review be complete and winners selected by?</h2>
          <Field>
            <ValidatedInput type="date" name="reviewEndDate" placeholder="End date" />
            <Error name="reviewEndDate" />
          </Field>
          <Field>
            <ValidatedInput type="time" name="reviewEndTime" placeholder="End time" />
            <Error name="reviewEndTime" />
          </Field>
          <p className="text-gray-400 italic">
            Reviewers must claim this topic by (local timestamp) to score questions
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">Rewards</h2>
          <div className="flex flex-col md:flex-row gap-2 items-baseline">
            <div className="flex-grow w-full">
              <Field>
                <ValidatedSelect
                  name="rewardToken"
                  placeholder="Token"
                  options={[{ label: "DAI", value: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" }]}
                />
                <Error name="rewardToken" />
              </Field>
            </div>
            <div className="flex-grow w-full">
              <Field>
                <ValidatedInput name="rewardPool" placeholder="Token amount distributed across winners" />
                <Error name="rewardPool" />
              </Field>
            </div>
          </div>
          <p className="text-gray-400 italic">
            Rewards will be distributed to the top 10% of authors based on the Aggressive reward curve set for the
            challenge marketplace
          </p>
        </section>

        <Button variant="primary" type="submit">
          Next
        </Button>
      </ValidatedForm>
      <Modal title="Launch Challenge?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction serviceRequest={modalData.serviceRequest} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({
  serviceRequest,
  onClose,
}: {
  serviceRequest?: ServiceRequestContract;
  onClose: () => void;
}) {
  invariant(serviceRequest, "serviceRequest is required"); // this should never happen but just in case

  const { write: writeServiceRequest } = useCreateServiceRequest({
    data: serviceRequest,
    onTransactionSuccess() {
      toast.dismiss("creating-challenge");
      toast.success("Challenge created!");
      onClose();
    },
    onWriteSuccess() {
      toast.loading("Creating challenge...", { id: "creating-challenge" });
    },
  });

  const { write: writeApprove } = useApproveERC20({
    data: {
      ERC20address: serviceRequest.pTokenAddress,
      amount: serviceRequest.pTokenQuantity,
      spender: serviceRequest.laborMarketAddress as `0x${string}`,
    },
    onTransactionSuccess() {
      toast.dismiss("approving-challenge");
      toast.success("Challenge approved!");
    },
    onWriteSuccess() {
      toast.loading("Approving challenge to spend ERC20...", { id: "approving-challenge" });
    },
  });

  const onLaunch = () => {
    writeServiceRequest?.();
  };

  const onApprove = () => {
    writeApprove?.();
  };

  return (
    <div className="space-y-8">
      <p>
        First you must approve to transer <b>{serviceRequest.pTokenQuantity}</b> of the ERC20 with address{" "}
        <b>{serviceRequest.pTokenAddress}</b> on your behalf{" "}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onApprove}>
          Approve
        </Button>
      </div>
      <p>Please confirm that you would like to launch a new challenge.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onLaunch}>
          Launch
        </Button>
        <Button variant="cancel" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function BrainstormHeader() {
  return (
    <div className="space-y-3">
      <h1 className="font-semibold text-3xl">Launch a Brainstorm Challenge</h1>
      <p className="text-lg text-cyan-500">
        Source and prioritize questions, problems, or tooling needs for Web3 analysts to address.
      </p>
      <p className="text-sm text-gray-500">
        You fund and launch a Brainstorm challenge. The community submits ideas. Peer reviewers score and surface the
        best ideas. Winners earn tokens from your reward pool!
      </p>
    </div>
  );
}

function AnalyticsHeader() {
  return (
    <div className="space-y-3">
      <h1 className="font-semibold text-3xl">Launch an Analytics Challenge</h1>
      <p className="text-lg text-cyan-500">
        Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
        projects launch, grow and succeed.
      </p>
      <p className="text-sm text-gray-500">
        You fund and launch an Analytics challenge. Analysts submit work. Peer reviewers score and surface the best
        outputs. Winners earn tokens from your reward pool!
      </p>
    </div>
  );
}

function BrainstormInput() {
  return (
    <>
      <h2 className="font-bold">Ask the community what they would like to see Web3 analysts address</h2>
      <Field>
        <ValidatedTextarea
          name="description"
          rows={7}
          placeholder="Enter a prompt to source ideas on questions to answer, problems to solve, or tools to create for a specific chain/project, theme, or topic. 

    Example: What are the most important questions to answer about user behavior on Ethereum?"
        />
        <Error name="description" />
      </Field>
    </>
  );
}

function AnalyticsInput() {
  return (
    <>
      <h2 className="font-bold">What question, problem, or tooling need do you want Web3 analysts to address?</h2>
      <Field>
        <ValidatedTextarea
          name="description"
          rows={7}
          placeholder="Enter a question to answer, problem to solve, or tool to create. 

          Be specific. Define metrics. Specify time boundaries. Example: How many addresses have transferred SUSHI on Ethereum in the last 90 days?"
        />
        <Error name="description" />
      </Field>
    </>
  );
}
