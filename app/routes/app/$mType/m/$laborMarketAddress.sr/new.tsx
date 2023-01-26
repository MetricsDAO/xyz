import { useParams } from "@remix-run/react";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Button, Container, Modal } from "~/components";
import type { ServiceRequestContract } from "~/domain";
import { fakeServiceRequestFormData, ServiceRequestFormSchema } from "~/domain";
import { ChallengeForm } from "~/features/challenge-form";
import { ApproveERC20TransferWeb3Button } from "~/features/web3-button/approve-erc20-transfer";
import { CreateServiceRequestWeb3Button } from "~/features/web3-button/create-service-request";
import type { SendTransactionResult } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { prepareServiceRequest } from "~/services/service-request.server";
import { listTokens } from "~/services/tokens.server";
import { createServiceRequest } from "~/utils/fetch";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";

const validator = withZod(ServiceRequestFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string() });
const serviceRequestMachine = createBlockchainTransactionStateMachine<ServiceRequestContract>();

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;
  const tokens = await listTokens();
  return typedjson({ defaultValues, tokens });
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
  const { mType } = useParams();
  const { defaultValues, tokens } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  const [state, send] = useMachine(serviceRequestMachine, {
    actions: {
      ...defaultNotifyTransactionActions,
      devAutoIndex: (context) => {
        if (window.ENV.DEV_AUTO_INDEX) {
          invariant(context.contractData, "Contract data is required");
          createServiceRequest({
            ...context.contractData,
            contractId: "1", // hardcoding to 1 for now. Doesn't seem to be a way to get this out of the receipt
          });
        }
      },
    },
  });

  const [modalOpen, setModalOpen] = useState(false);

  // DEBUG
  // console.log("state", state.value, state.context);

  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      // Clear any previous transaction state
      send({ type: "RESET_TRANSACTION" });
      send({ type: "PREPARE_TRANSACTION_PREAPPROVE", data: actionData.preparedServiceRequest });
      setModalOpen(true);
    }
  }, [actionData, send]);

  const onERC20ApproveWriteSuccess = (result: SendTransactionResult) => {
    send({
      type: "SUBMIT_PREAPPROVE_TRANSACTION",
      preapproveTransactionHash: result.hash,
      preapproveTransactionPromise: result.wait(1),
    });
  };

  const onCreateServiceRequestWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Container className="max-w-3xl my-10 space-y-10">
      {mType === "brainstorm" ? <BrainstormHeader /> : <AnalyticsHeader />}

      <ValidatedForm
        method="post"
        defaultValues={{
          language: "english",
          ...defaultValues,
        }}
        validator={validator}
        className="space-y-10"
      >
        <ChallengeForm validTokens={tokens} />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </ValidatedForm>
      {state.context.contractData && (
        <Modal isOpen={modalOpen && !state.matches("transactionWait.success")} onClose={closeModal} closeButton={false}>
          <div className="space-y-2 flex flex-col items-center px-2">
            <p className="font-medium">Launch Challenge</p>
            {state.matches("transactionPrepared.preapprove.ready") && (
              <div className="space-y-6 text-sm text-center text-stone-500">
                <p>
                  Approve the app to transfer{" "}
                  <b className="text-neutral-800">{state.context.contractData.pTokenQuantity}</b> "token" on your behalf
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button variant="cancel" size="md" onClick={closeModal} fullWidth>
                    Cancel
                  </Button>
                  <ApproveERC20TransferWeb3Button
                    data={{
                      amount: state.context.contractData.pTokenQuantity,
                      ERC20address: state.context.contractData.pTokenAddress,
                      spender: state.context.contractData.laborMarketAddress as `0x${string}`,
                    }}
                    onWriteSuccess={onERC20ApproveWriteSuccess}
                  />
                </div>
              </div>
            )}
            {state.matches("transactionPrepared.preapprove.loading") && (
              <div className="text-sm text-center text-stone-500">
                <img
                  src="/img/loading-icon.png"
                  alt=""
                  className="mb-8 mt-5 mx-auto animate-[rotate360_3s_linear_infinite]"
                />
                <p>Approving {state.context.contractData.pTokenQuantity} "token"</p>
              </div>
            )}
            {state.matches("transactionPrepared.preapprove.success") && (
              <div className="space-y-8">
                <p className="text-sm text-center text-stone-500 max-w-xs">
                  Confirm you would like to launch this challenge and transfer funds.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button variant="cancel" size="md" onClick={closeModal} fullWidth>
                    Cancel
                  </Button>
                  <CreateServiceRequestWeb3Button
                    data={state.context.contractData}
                    onWriteSuccess={onCreateServiceRequestWriteSuccess}
                  />
                </div>
              </div>
            )}
            {state.matches("transactionWait") && (
              <div className="text-sm text-center text-stone-500">
                <img
                  src="/img/loading-icon.png"
                  alt=""
                  className="mb-8 mt-5 mx-auto animate-[rotate360_3s_linear_infinite]"
                />
                <p>Transferring {state.context.contractData.pTokenQuantity} "token"</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </Container>
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
