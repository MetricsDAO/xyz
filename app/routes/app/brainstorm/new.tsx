import type { ActionArgs } from "@remix-run/node";
import { useNavigate, useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import { Container } from "~/components/Container";
import { MarketplaceForm } from "~/features/marketplace-form";
import { Modal } from "~/components/modal";
import type { LaborMarketNew, LaborMarketPrepared } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { useCreateMarketplace } from "~/hooks/useCreateMarketplace";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

export const loader = async () => {
  const projects = await listProjects();
  const tokens = await listTokens();
  return typedjson({ projects, tokens });
};

const validator = withZod(LaborMarketNewSchema);

type ActionResponse = { preparedLaborMarket: LaborMarketPrepared } | ValidationErrorResponseData;
export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  const preparedLaborMarket = await prepareLaborMarket(result.data);
  return typedjson({ preparedLaborMarket });
};

export default function CreateMarketplace() {
  const transition = useTransition();
  const { projects, tokens } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  const [modalData, setModalData] = useState<{ laborMarket?: LaborMarketPrepared; isOpen: boolean }>({ isOpen: false });

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
        <ValidatedForm<LaborMarketNew>
          validator={validator}
          method="post"
          defaultValues={{ launch: { access: "anyone" } }}
        >
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit">
              {transition.state === "submitting" ? "Loading..." : "Next"}
            </Button>
          </div>
        </ValidatedForm>
      </div>
      <Modal title="Create Marketplace?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction laborMarket={modalData.laborMarket} onCancel={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ laborMarket, onCancel }: { laborMarket?: LaborMarketPrepared; onCancel: () => void }) {
  invariant(laborMarket, "laborMarket is required"); // this should never happen but just in case

  const navigate = useNavigate();

  const { write, isLoading } = useCreateMarketplace({
    data: laborMarket,
    onTransactionSuccess() {
      navigate("/app/brainstorm");
    },
    onWriteSuccess() {
      // TODO: toast message or some kind of feedback
    },
  });

  return (
    <div className="space-y-8">
      <p>Please confirm that you would like to create a new marketplace.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <Button size="md" type="button" onClick={() => write?.()} loading={isLoading}>
          Create
        </Button>
        <Button variant="cancel" size="md" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
