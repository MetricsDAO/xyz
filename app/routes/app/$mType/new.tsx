import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { useParams, useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button, Container, Modal } from "~/components";
import type { LaborMarketContract, LaborMarketForm } from "~/domain";
import { fakeLaborMarketNew, LaborMarketFormSchema } from "~/domain";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { MarketplaceForm } from "~/features/marketplace-form";
import { RPCError } from "~/features/rpc-error";
import { CreateLaborMarketWeb3Button } from "~/features/web3-button/create-labor-market";
import type { EthersError, SendTransactionResult } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { getUser } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";
import { createLaborMarket } from "~/utils/fetch";
import { removeLeadingZeros } from "~/utils/helpers";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const projects = await listProjects();
  const tokens = await listTokens();
  const defaultValues = url.searchParams.get("fake")
    ? fakeLaborMarketNew()
    : ({ launch: { access: "delegates", badgerAddress: "", badgerTokenId: "" } } as const);
  return typedjson({ projects, tokens, defaultValues });
};

const validator = withZod(LaborMarketFormSchema);
const machine = createBlockchainTransactionStateMachine<LaborMarketContract>();

type ActionResponse = { preparedLaborMarket: LaborMarketContract } | ValidationErrorResponseData;
export const action = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  invariant(user, "You must be logged in to create a marketplace");
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedLaborMarket = await prepareLaborMarket(result.data, user);
  return typedjson({ preparedLaborMarket });
};

export default function CreateMarketplace() {
  const transition = useTransition();
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const { mType } = useParams();

  const [state, send] = useMachine(machine, {
    actions: {
      ...defaultNotifyTransactionActions,
      devAutoIndex: (context) => {
        // Create marketplace in the database as a dx side-effect
        if (window.ENV.DEV_AUTO_INDEX) {
          invariant(context.contractData, "Contract data is required");
          invariant(context.transactionReceipt, "Transaction receipt is required");
          // fire and forget
          createLaborMarket({
            ...context.contractData,
            address: removeLeadingZeros(context.transactionReceipt.logs[0]?.topics[1] as string), // The labor market created address
            sponsorAddress: context.contractData.userAddress,
          });
        }
      },
    },
  });
  // DEBUG
  // console.log("state", state.value, state.context);

  const [modalOpen, setModalOpen] = useState(false);

  // If action succeeds the transaction is ready to be written to the blockchain
  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      // Clear any previous transaction state
      send({ type: "RESET_TRANSACTION" });
      send({ type: "PREPARE_TRANSACTION_READY", data: actionData.preparedLaborMarket });
      setModalOpen(true);
    }
  }, [actionData, send]);

  const closeModal = () => {
    setModalOpen(false);
  };

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketForm> validator={validator} method="post" defaultValues={defaultValues}>
          <h1 className="text-3xl font-semibold antialiased">
            Create {mType === "brainstorm" ? "a Brainstorm" : "an Analytics"} Marketplace
          </h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <ConnectWalletWrapper>
              <Button size="lg" type="submit">
                {transition.state === "submitting" ? "Loading..." : "Next"}
              </Button>
            </ConnectWalletWrapper>
          </div>
        </ValidatedForm>
      </div>
      {state.context.contractData && (
        <Modal title="Create Marketplace?" isOpen={modalOpen} onClose={closeModal}>
          <div className="space-y-8">
            <p>Please confirm that you would like to create a new marketplace.</p>
            {error && <RPCError error={error} />}
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <CreateLaborMarketWeb3Button
                data={state.context.contractData}
                onWriteSuccess={onWriteSuccess}
                onPrepareTransactionError={onPrepareTransactionError}
              />
              <Button variant="cancel" size="md" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}
