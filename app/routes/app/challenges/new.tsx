import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson/dist/remix";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { Button } from "~/components/button";
import { useTransition } from "@remix-run/react";
import { Container } from "~/components/Container";
import type { ChallengeNew } from "~/domain/challenge";
import { ChallengeNewSchema } from "~/domain/challenge";
import { useAccount } from "wagmi";
import { ChallengeForm } from "~/features/challenge-form";
import { searchLaborMarkets } from "~/services/labor-market.server";
import { LaborMarketSearchSchema } from "~/domain";

export const loader = async ({ request }: DataFunctionArgs) => {
  const search = LaborMarketSearchSchema.parse({ type: "brainstorm" });
  const laborMarkets = await searchLaborMarkets(search);

  return typedjson({ laborMarkets });
};

const validator = withZod(ChallengeNewSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  // const data = await validator.validate(await request.formData());
  // if (data.error) return validationError(data.error);
  // const prepared = await prepareLaborMarket(data.data);
  // return typedjson({ prepared });
};

export default function CreateMarketplace() {
  const { laborMarkets } = useTypedLoaderData<typeof loader>();
  const transition = useTransition();
  const { isConnected } = useAccount();

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <ValidatedForm<ChallengeNew> validator={validator} method="post">
          <h1 className="text-3xl font-semibold antialiased">Create Challenge Marketplace</h1>
          <ChallengeForm laborMarkets={laborMarkets} />
          <div className="flex space-x-4 mt-6">
            <Button size="lg" type="submit" disabled={!isConnected} loading={transition.state === "submitting"}>
              Launch Challenge
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
