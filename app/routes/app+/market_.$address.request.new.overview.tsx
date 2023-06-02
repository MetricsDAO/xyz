import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { findTokenBySymbol } from "~/services/tokens.server";
import { requireUser } from "~/services/session.server";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { notFound } from "remix-utils";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { EvmAddressSchema } from "~/domain/address";
import { findProjectsBySlug } from "~/services/projects.server";
import { z } from "zod";
import { ServiceRequestCreator } from "~/features/service-request-creator/service-request-creator";
import { fakeServiceRequestFormData } from "~/features/service-request-creator/schema";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;

  const laborMarket = await getLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketTokens = await findTokenBySymbol(laborMarket.appData.tokenAllowlist);

  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ address, laborMarketTokens, laborMarketProjects, defaultValues });
};

export default function ChallengeOverview() {
  const [formData] = useOutletContext<OutletContext>();
  const { laborMarketTokens, address, laborMarketProjects, defaultValues } = useTypedLoaderData<typeof loader>();
  return (
    <ServiceRequestCreator
      tokens={laborMarketTokens}
      projects={laborMarketProjects}
      laborMarketAddress={address}
      defaultValues={formData}
    />
  );
}
