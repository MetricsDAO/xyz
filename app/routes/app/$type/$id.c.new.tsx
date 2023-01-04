import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Container, Modal } from "~/components";
import { Button } from "~/components/button";
import { ValidatedInput } from "~/components/input/input";
import { ValidatedSelect } from "~/components/select";
import { ValidatedTextarea } from "~/components/textarea/textarea";
import type { ChallengePrepared } from "~/domain";
import { ChallengeNewSchema, fakeChallengeNew } from "~/domain";
import { useIncreaseAllowance } from "~/hooks/use-increase-allowance";
import { useSubmitRequest } from "~/hooks/use-submit-request";
import { prepareChallenge } from "~/services/challenges-service.server";

const validator = withZod(ChallengeNewSchema);

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeChallengeNew() : undefined;
  return typedjson({ defaultValues, laborMarketAddress: id });
};

type ActionResponse = { preparedChallenge: ChallengePrepared } | ValidationErrorResponseData;
export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedChallenge = await prepareChallenge(result.data);
  return typedjson({ preparedChallenge });
};

export default function CreateChallenge() {
  const { defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  const [modalData, setModalData] = useState<{ challenge?: ChallengePrepared; isOpen: boolean }>({ isOpen: false });

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && "preparedChallenge" in actionData) {
      setModalData({ challenge: actionData.preparedChallenge, isOpen: true });
    }
  }, [actionData]);

  return (
    <Container className="max-w-3xl mt-10 space-y-10">
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

      <ValidatedForm method="post" defaultValues={defaultValues} validator={validator} className="space-y-10">
        <section className="space-y-3">
          <h2 className="font-bold">Challenge Title</h2>
          <ValidatedInput name="title" placeholder="Challenge Title" className="w-full" />
        </section>
        <section className="space-y-3">
          <h2 className="font-bold">What do you want to source questions about?</h2>
          <ValidatedTextarea
            name="description"
            placeholder="Crowdsource the best questions for blockchain analysts to answer about any web3 topic."
          />
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <ValidatedSelect
                name="language"
                placeholder="Language"
                options={[
                  { label: "English", value: "english" },
                  { label: "Spanish", value: "spanish" },
                ]}
              />
            </div>
            <div className="flex-grow">
              <ValidatedSelect
                name="projects"
                placeholder="Blockchain/Project(s)"
                options={[
                  { label: "Ethereum", value: "ethereum" },
                  { label: "Solana", value: "solana" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When will submissions be accepted</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <p>Start</p>
              <ValidatedInput type="date" name="startDate" placeholder="Start date" />
              <ValidatedInput type="time" name="startTime" placeholder="Start time" />
            </div>
            <div className="flex-grow">
              <p>End</p>
              <ValidatedInput type="date" name="endDate" placeholder="End date" />
              <ValidatedInput type="time" name="endTime" placeholder="End time" />
            </div>
          </div>
          <p className="text-gray-400 italic">
            Authors must claim this topic by (local timestamp) to submit question ideas
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When must peer review be complete and winners selected by?</h2>
          <ValidatedInput type="date" name="reviewEndDate" placeholder="End date" />
          <ValidatedInput type="time" name="reviewEndTime" placeholder="End time" />
          <p className="text-gray-400 italic">
            Reviewers must claim this topic by (local timestamp) to score questions
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">Rewards</h2>
          <div className="flex flex-col md:flex-row gap-2 items-baseline">
            <div className="flex-grow w-full">
              <ValidatedSelect
                name="rewardToken"
                placeholder="Token"
                options={[
                  { label: "FAU", value: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc" }, // FAU token https://erc20faucet.com/
                ]}
              />
            </div>
            <div className="flex-grow w-full">
              <ValidatedInput name="rewardPool" placeholder="Token amount distributed across winners" />
            </div>
          </div>
          <p className="text-gray-400 italic">
            Rewards will be distributed to the top 10% of authors based on the Aggressive reward curve set for the
            challenge marketplace
          </p>
        </section>

        <div className="flex flex-row flex-wrap gap-5">
          <Button variant="primary" type="submit">
            Launch Challenge
          </Button>
          <Button variant="cancel">Cancel</Button>
        </div>
      </ValidatedForm>
      <Modal title="Launch Challenge?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction challenge={modalData.challenge} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ challenge, onClose }: { challenge?: ChallengePrepared; onClose: () => void }) {
  invariant(challenge, "challenge is required"); // this should never happen but just in case

  const [isApproved, setIsApproved] = useState(false);

  const { write: writeChallenge } = useSubmitRequest({
    data: challenge,
    onTransactionSuccess() {
      toast.dismiss("creating-challenge");
      toast.success("Challenge created!");
    },
    onWriteSuccess() {
      toast.loading("Creating challenge...", { id: "creating-challenge" });
    },
  });

  const { write: writeIncreaseAllowance } = useIncreaseAllowance({
    data: {
      ERC20address: challenge.pTokenAddress,
      amount: challenge.pTokenQuantity,
      spender: challenge.laborMarketAddress as `0x${string}`,
    },
    onTransactionSuccess() {
      toast.dismiss("approving-challenge");
      toast.success("Challenge approved!");
      setIsApproved(true);
    },
    onWriteSuccess() {
      toast.loading("Approving challenge to spend ERC20...", { id: "approving-challenge" });
    },
  });

  const onCreateChallenge = () => {
    writeChallenge?.();
  };

  const onIncreaseAllowance = () => {
    writeIncreaseAllowance?.();
  };

  return (
    <div className="space-y-8">
      {!isApproved && (
        <>
          <p className="p-5 text-sm">
            First you must approve that your service request is allowed to transer <b>{challenge.pTokenQuantity}</b> of
            ERC20 with address <b>{challenge.pTokenAddress}</b> on your behalf{" "}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button size="md" type="button" onClick={onIncreaseAllowance}>
              Approve
            </Button>
            <Button variant="cancel" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      )}
      {isApproved && (
        <>
          <p>Please confirm that you would like to launch a new challenge.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button size="md" type="button" onClick={onCreateChallenge}>
              Launch
            </Button>
            <Button variant="cancel" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
