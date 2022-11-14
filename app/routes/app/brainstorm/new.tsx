import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson";
import { MarketplaceForm } from "~/components/MarketplaceForm";
import type { LaborMarketNew } from "~/domain";
import { LaborMarketNewSchema } from "~/domain";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Text, Title } from "@mantine/core";
import { prepareLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

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
  // const actionData = useTypedActionData<typeof action>;
  const { projects, tokens } = useTypedLoaderData<typeof loader>();

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="max-w-2xl">
        <ValidatedForm<LaborMarketNew>
          validator={validator}
          method="post"
          defaultValues={{ launchAccess: "anyone", projectIds: [], tokenSymbols: [] }}
        >
          <Title order={2} weight={600}>
            Create Challenge Marketplace
          </Title>
          <MarketplaceForm projects={projects} tokens={tokens} />
        </ValidatedForm>
      </div>
    </div>
  );
}
