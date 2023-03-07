import type { DataFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { Container } from "~/components";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { fakeLaborMarketFormValues, LaborMarketCreator } from "~/features/labor-market-creator";

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const projects = await listProjects();
  const tokens = await listTokens();
  const defaultValues = url.searchParams.get("fake") ? fakeLaborMarketFormValues() : undefined;
  return typedjson({ projects, tokens, defaultValues });
};

export default function CreateMarketplace() {
  const { mType } = useParams();
  const { projects, tokens, defaultValues } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold antialiased">
          Create {mType === "brainstorm" ? "a Brainstorm" : "an Analytics"} Marketplace
        </h1>

        <LaborMarketCreator projects={projects} tokens={tokens} defaultValues={defaultValues} />
        {/* <ValidatedForm validator={validator} defaultValues={{}} method="post">
          <h1 className="text-3xl font-semibold antialiased">
            Create {mType === "brainstorm" ? "a Brainstorm" : "an Analytics"} Marketplace
          </h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <button type="submit">Submit</button>
          <div className="flex space-x-4 mt-6">
            <ConnectWalletWrapper>
              <Button size="lg" type="submit">
                {transition.state === "submitting" ? "Loading..." : "Next"}
              </Button>
            </ConnectWalletWrapper>
          </div>
        </ValidatedForm> */}
      </div>

      {/* <Modal title="Create Marketplace?" isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        {!isValidationError(actionData) ? <ConfirmModal formData={actionData} /> : null}
        <div className="space-y-8">
          <p>Please confirm that you would like to create a new marketplace.</p>
          {error && <RPCError error={error} />}
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {!error && (
              <CreateLaborMarketWeb3Button
                data={state.context.contractData}
                onWriteSuccess={onWriteSuccess}
                onPrepareTransactionError={onPrepareTransactionError}
              />
            )}
            <Button variant="cancel" size="md" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal> */}
    </Container>
  );
}

// function ConfirmModal({ formData }: { formData: LaborMarketForm }) {
//   const error = useCreateLaborMarket(formData);
//   return (
//     <div className="space-y-8">
//       <p>Please confirm that you would like to create a new marketplace.</p>
//       {error && <RPCError error={error} />}
//       <div className="flex flex-col sm:flex-row justify-center gap-5">
//         {!error && (
//           <CreateLaborMarketWeb3Button
//             data={state.context.contractData}
//             onWriteSuccess={onWriteSuccess}
//             onPrepareTransactionError={onPrepareTransactionError}
//           />
//         )}
//         <Button variant="cancel" size="md" onClick={closeModal}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// }
