import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button, Container, Modal } from "~/components";
import type { LaborMarketForm, LaborMarketContract } from "~/domain";
import { fakeLaborMarketNew, LaborMarketFormSchema } from "~/domain";
import { MarketplaceForm } from "~/features/marketplace-form";
import { useCreateLaborMarket } from "~/hooks/use-create-labor-market";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { getUser } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";
import { blockchainMachine } from "~/utils/machine";
import { useMachine } from "@xstate/react";

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

// type ActionResponse = { preparedLaborMarket: LaborMarketContract } | ValidationErrorResponseData;
// export const action = async ({ request }: ActionArgs) => {
//   const user = await getUser(request);
//   invariant(user, "You must be logged in to create a marketplace");
//   const result = await validator.validate(await request.formData());
//   if (result.error) return validationError(result.error);

//   const preparedLaborMarket = await prepareLaborMarket(result.data, user);
//   return typedjson({ preparedLaborMarket });
// };

export default function CreateMarketplace() {
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();

  const [state, send] = useMachine(blockchainMachine);

  const isUploadingToIpfs = state.matches("transactionPrepare.loading");
  const isModalOpen = state.matches("transactionReady") || state.matches("transactionWrite");

  console.log("state", state.value);

  const closeModal = () => {
    send({ type: "TRANSACTION_CANCEL" });
  };

  const onTransactionSuccess = () => {
    send({ type: "TRANSACTION_SUCCESS" });
  };

  const onWriteSuccess = () => {
    send({ type: "TRANSACTION_WRITE" });
  };

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketForm>
          validator={validator}
          defaultValues={defaultValues}
          onSubmit={(data, event) => {
            event.preventDefault();
            send({ type: "TRANSACTION_PREPARE", data });
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
      <Modal title="Create Marketplace?" isOpen={isModalOpen} onClose={closeModal}>
        <ConfirmTransaction
          data={state.context.contractData}
          onClose={closeModal}
          onTransactionSuccess={onTransactionSuccess}
          onWriteSuccess={onWriteSuccess}
        />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({
  data,
  onClose,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data?: LaborMarketContract;
  onClose: () => void;
  onTransactionSuccess?: () => void;
  onWriteSuccess?: () => void;
}) {
  invariant(data, "data is required"); // this should never happen but just in case

  const { write, isLoading } = useCreateLaborMarket({
    data,
    onTransactionSuccess,
    onWriteSuccess,
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <div className="space-y-8">
      <p>Please confirm that you would like to create a new marketplace.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={onCreate} loading={isLoading}>
          Create
        </Button>
        <Button variant="cancel" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
