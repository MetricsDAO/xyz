import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson";
import { MarketplaceForm } from "~/components/MarketplaceForm";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { Button } from "~/components/button";
import { useAccount } from "wagmi";
import { useTransition } from "@remix-run/react";
import { Container } from "~/components/Container";

export const loader = async () => {
  const projects = await listProjects();
  const tokens = await listTokens();
  return typedjson({ projects, tokens });
};

const validator = withZod(LaborMarketNewSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  const prepared = await prepareLaborMarket(data.data);
  return typedjson({ prepared });
};

export default function CreateMarketplace() {
  const transition = useTransition();
  const { isConnected } = useAccount();
  const { projects, tokens } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <ValidatedForm<LaborMarketNew>
          validator={validator}
          method="post"
          defaultValues={{ launchAccess: "anyone", projectIds: [], tokenSymbols: [] }}
        >
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <MarketplaceForm projects={projects} tokens={tokens} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit" disabled={!isConnected} loading={transition.state === "submitting"}>
              Create Marketplace
            </Button>
            <Button size="lg" variant="cancel">
              Cancel
            </Button>
          </div>
        </ValidatedForm>
      </div>
    </Container>
  );
}
