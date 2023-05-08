import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { badRequest, notFound } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { fakeServiceRequestFormData } from "~/features/service-request-creator/schema";
import { ServiceRequestCreator } from "~/features/service-request-creator/service-request-creator";
import { findProjectsBySlug } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { requireUser } from "~/services/session.server";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;
  const tokens = await listTokens();

  if (!laborMarket.appData) {
    throw badRequest("Labor market app data is required");
  }
  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ defaultValues, laborMarket, laborMarketProjects, tokens });
};

export default function CreateServiceRequest() {
  const { defaultValues, tokens, laborMarketProjects, laborMarket } = useTypedLoaderData<typeof loader>();

  const validTokens = laborMarket.appData.tokenAllowlist
    .map((symbol) => tokens.find((t) => t.symbol === symbol))
    .filter((t): t is typeof tokens[number] => !!t);

  return (
    <div className="max-w-2xl mx-auto my-10 space-y-10">
      <div className="space-y-3">
        <h1 className="font-semibold text-3xl">Launch an Analytics Challenge</h1>
        <p className="text-lg text-cyan-500">
          Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
          projects launch, grow and succeed.
        </p>
        <p className="text-sm text-gray-500">
          You fund and launch an Analytics challenge. Analysts submit work. Peer reviewers score and surface the best
          outputs. Winners earn tokens from your reward pool!
        </p>
      </div>
      <ServiceRequestCreator
        projects={laborMarketProjects}
        tokens={validTokens}
        defaultValues={defaultValues}
        laborMarketAddress={laborMarket.address}
      />
    </div>
  );
}
