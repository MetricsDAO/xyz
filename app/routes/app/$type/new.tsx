import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button, Container, Modal } from "~/components";
import type { LaborMarketContract, LaborMarketForm } from "~/domain";
import { fakeLaborMarketNew, LaborMarketFormSchema } from "~/domain";
import { MarketplaceForm } from "~/features/marketplace-form";
import { CreateLaborMarketWeb3Button } from "~/features/web3-button/create-labor-market";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { getUser } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { isValidationError } from "~/utils/utils";
import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { createLaborMarket } from "~/utils/fetch";
import { removeLeadingZeros } from "~/utils/helpers";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const projects = await listProjects();
  const tokens = await listTokens();
  const defaultValues = url.searchParams.get("fake")
    ? fakeLaborMarketNew()
    : ({ launch: { access: "anyone" } } as const);
  return typedjson({ projects, tokens, defaultValues });
};

const validator = withZod(LaborMarketFormSchema);

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
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const [state, send] = useMachine(createBlockchainTransactionStateMachine<LaborMarketContract>(), {
    actions: {
      notifyTransactionWrite: (context) => {
        // Link to transaction? https://goerli.etherscan.io/address/${context.transactionHash}
        toast.loading("Creating marketplace...", { id: "creating-marketplace" });
      },
      notifyTransactionSuccess: () => {
        toast.dismiss("creating-marketplace");
        toast.success("Marketplace created!");
      },
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

  const isUploadingToIpfs = state.matches("transactionPrepare.loading");
  const isModalOpen = state.matches("transactionReady") || state.matches("transactionWrite");

  // If action succeeds the transaction is ready to be written to the blockchain
  useEffect(() => {
    if (actionData && !isValidationError(actionData)) {
      send({ type: "TRANSACTION_READY", data: actionData.preparedLaborMarket });
    }
  }, [actionData, send]);

  // Debug
  // console.log("state", state.value, state.context);

  const closeModal = () => {
    send({ type: "TRANSACTION_CANCEL" });
  };

  const onTransactionSuccess = (transactionReceipt: TransactionReceipt) => {
    send({ type: "TRANSACTION_SUCCESS", transactionReceipt });
  };

  const onWriteSuccess = (transactionHash: `0x${string}`) => {
    send({ type: "TRANSACTION_WRITE", transactionHash });
  };

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketForm>
          validator={validator}
          method="post"
          defaultValues={defaultValues}
          onSubmit={(data, event) => {
            send({ type: "TRANSACTION_PREPARE" });
          }}
        >
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit">
              {isUploadingToIpfs ? "Loading..." : "Next"}
            </Button>
          </div>
        </ValidatedForm>
      </div>
      {state.context.contractData && (
        <Modal title="Create Marketplace?" isOpen={isModalOpen} onClose={closeModal}>
          <div className="space-y-8">
            <p>Please confirm that you would like to create a new marketplace.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <CreateLaborMarketWeb3Button
                data={state.context.contractData}
                onTransactionSuccess={onTransactionSuccess}
                onWriteSuccess={onWriteSuccess}
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
