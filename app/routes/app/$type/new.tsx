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
  const transition = useTransition();
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  const [modalData, setModalData] = useState<{ laborMarket?: LaborMarketContract; isOpen: boolean }>({ isOpen: false });

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  useEffect(() => {
    if (actionData && "preparedLaborMarket" in actionData) {
      setModalData({ laborMarket: actionData.preparedLaborMarket, isOpen: true });
    }
  }, [actionData]);

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketForm> validator={validator} method="post" defaultValues={defaultValues}>
          <h1 className="text-3xl font-semibold antialiased">Create a Brainstorm Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit">
              {transition.state === "submitting" ? "Loading..." : "Next"}
            </Button>
          </div>
        </ValidatedForm>
      </div>
      <Modal title="Create Marketplace?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction laborMarket={modalData.laborMarket} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ laborMarket, onClose }: { laborMarket?: LaborMarketContract; onClose: () => void }) {
  invariant(laborMarket, "laborMarket is required"); // this should never happen but just in case

  const { write, isLoading } = useCreateLaborMarket({
    data: laborMarket,
    onTransactionSuccess() {
      toast.dismiss("creating-marketplace");
      toast.success("Marketplace created!");
      onClose();
    },
    onWriteSuccess() {
      toast.loading("Creating marketplace...", { id: "creating-marketplace" });
    },
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
