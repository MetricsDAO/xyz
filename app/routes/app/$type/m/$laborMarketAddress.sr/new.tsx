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
import { useSubmitRequest } from "~/hooks/use-submit-request";
import { prepareServiceRequest } from "~/services/challenges-service.server";

const validator = withZod(ServiceRequestFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string() });

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;
  return typedjson({ defaultValues });
};

type ActionResponse = { preparedChallenge: ServiceRequestContract } | ValidationErrorResponseData;
export const action = async ({ request, params }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  const { laborMarketAddress } = paramsSchema.parse(params);
  if (result.error) return validationError(result.error);

  const preparedChallenge = await prepareServiceRequest(laborMarketAddress, result.data);
  return typedjson({ preparedChallenge });
};

export default function CreateChallenge() {
  const { defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  const [modalData, setModalData] = useState<{ challenge?: ServiceRequestContract; isOpen: boolean }>({
    isOpen: false,
  });

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && "preparedChallenge" in actionData) {
      setModalData({ challenge: actionData.preparedChallenge, isOpen: true });
    }
  }, [actionData]);

  return (
    <Container className="max-w-3xl my-10 space-y-10">
      <div className="space-y-3">
        <h1 className="font-semibold text-3xl">Launch Challenge</h1>
        <p className="text-lg text-cyan-500">
          Reward peers to crowdsource the best questions for blockchain analysts to answer about any web3 topic
        </p>
        <p>
          Crowdsource the best questions for crypto analysts to answer about an important or timely challenge. Create
          and incentivize a question brainstorm for any web3 challenge to get started.
        </p>
      </div>

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
          <h2 className="font-bold">What do you want to source questions about?</h2>
          <Field>
            <ValidatedTextarea
              name="description"
              placeholder="Crowdsource the best questions for blockchain analysts to answer about any web3 topic."
            />
            <Error name="description" />
          </Field>
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
                  options={[
                    { label: "FAU", value: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc" }, // FAU token https://erc20faucet.com/
                  ]}
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

        <div className="flex flex-row flex-wrap gap-5">
          <Button variant="primary" type="submit">
            Next
          </Button>
        </div>
      </ValidatedForm>
      <Modal title="Launch Challenge?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction challenge={modalData.challenge} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ challenge, onClose }: { challenge?: ServiceRequestContract; onClose: () => void }) {
  invariant(challenge, "challenge is required"); // this should never happen but just in case

  const { write: writeChallenge } = useSubmitRequest({
    data: challenge,
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
      ERC20address: challenge.pTokenAddress,
      amount: challenge.pTokenQuantity,
      spender: challenge.laborMarketAddress as `0x${string}`,
    },
    onTransactionSuccess() {
      toast.dismiss("approving-challenge");
      toast.success("Challenge approved!");
    },
    onWriteSuccess() {
      toast.loading("Approving challenge to spend ERC20...", { id: "approving-challenge" });
    },
  });

  const onCreateChallenge = () => {
    writeChallenge?.();
  };

  const onApprove = () => {
    writeApprove?.();
  };

  return (
    <div className="space-y-8">
      <p>
        First you must approve to transer <b>{challenge.pTokenQuantity}</b> of the ERC20 with address{" "}
        <b>{challenge.pTokenAddress}</b> on your behalf{" "}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onApprove}>
          Approve
        </Button>
      </div>
      <p>Please confirm that you would like to launch a new challenge.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onCreateChallenge}>
          Launch
        </Button>
        <Button variant="cancel" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
