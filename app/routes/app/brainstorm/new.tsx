import type { ActionArgs } from "@remix-run/node";
import { useNavigate, useTransition } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { typedjson } from "remix-typedjson";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import { Container } from "~/components/Container";
import { MarketplaceForm } from "~/components/MarketplaceForm";
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

export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  // if (true) {
  //   // server side validation
  //   return validationError({
  //     fieldErrors: {
  //       title: "title error",
  //     },
  //   });
  // }

  const prepared = await prepareLaborMarket(result.data);
  return typedjson(prepared);
};

export default function CreateMarketplace() {
  const transition = useTransition();
  const { projects, tokens } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<typeof action>();

  const [laborMarketPrepared, setLaborMarketPrepared] = useState<LaborMarketPrepared>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Bloody type hack because validation errors from action screw everything up
    if ((actionData as unknown as LaborMarketPrepared)?.ipfsHash) {
      setLaborMarketPrepared(actionData as unknown as LaborMarketPrepared);
    }
  }, [actionData]);

  useEffect(() => {
    if (laborMarketPrepared) {
      setOpenModal(true);
    }
  }, [laborMarketPrepared]);

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <ValidatedForm<LaborMarketNew> validator={validator} method="post" defaultValues={{ launchAccess: "anyone" }}>
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit" loading={transition.state === "loading"}>
              {transition.state === "submitting" ? "Loading..." : "Next"}
            </Button>
          </div>
        </ValidatedForm>
      </div>
      <Modal title="Create Marketplace?" isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ConfirmTransaction laborMarket={laborMarketPrepared} onCancel={() => setOpenModal(false)} />
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
