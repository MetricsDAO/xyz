import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";
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
import transactionToasts from "~/features/web3-transaction-toasts";
import { prepareServiceRequest } from "~/services/service-request.server";
import { createServiceRequest } from "~/utils/fetch";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";

const validator = withZod(ServiceRequestFormSchema);
const paramsSchema = z.object({ laborMarketAddress: z.string() });
const serviceRequestMachine = createBlockchainTransactionStateMachine<ServiceRequestContract>();

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

  const [state, send] = useMachine(serviceRequestMachine, {
    actions: {
      ...transactionToasts,
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

  const modalOpen = state.matches("transactionReady") || state.matches("transactionWrite");

  // DEBUG
  // console.log("state", state.value, state.context);

  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      send({ type: "TRANSACTION_PREAPPROVE", data: actionData.preparedServiceRequest });
    }
  }, [actionData, send]);

  const onERC20ApproveWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "TRANSACTION_PREAPPROVE_LOADING" });
    result
      .wait(1)
      .then(() => {
        send({ type: "TRANSACTION_PREAPPROVE_SUCCESS" });
      })
      .catch(() => {
        send({ type: "TRANSACTION_PREAPPROVE_FAILURE" });
      });
  };

  const onCreateServiceRequestWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "TRANSACTION_WRITE", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const closeModal = () => {
    send({ type: "TRANSACTION_CANCEL" });
  };

  return (
    <Container className="max-w-3xl my-10 space-y-10">
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

      <ValidatedForm
        method="post"
        defaultValues={{
          language: "english",
          ...defaultValues,
        }}
        validator={validator}
        className="space-y-10"
        onSubmit={(data) => {
          send({ type: "TRANSACTION_PREPARE" });
        }}
      >
        <ChallengeForm />
        <Button variant="primary" type="submit">
          Next
        </Button>
      </ValidatedForm>
      {state.context.contractData && (
        <Modal title="Launch Challenge" isOpen={modalOpen} onClose={closeModal}>
          {state.matches("transactionReady.preapproveReady") && (
            <div className="space-y-8">
              <p>Approve the app to transfer {state.context.contractData.pTokenQuantity} "TOKEN NAME" on your behalf</p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Button variant="cancel" size="md" onClick={closeModal}>
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
          {state.matches("transactionReady.preapproveLoading") && <div>Loading...</div>}
          {(state.matches("transactionReady.ready") || state.matches("transactionWrite")) && (
            <div>
              <p>Please confirm that you would like to launch a new challenge.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <CreateServiceRequestWeb3Button
                  data={state.context.contractData}
                  onWriteSuccess={onCreateServiceRequestWriteSuccess}
                />
                <Button variant="cancel" size="md" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Container>
  );
}
