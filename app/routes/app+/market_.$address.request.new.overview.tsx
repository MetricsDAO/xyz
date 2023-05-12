import { useOutletContext } from "@remix-run/react";
import { OutletContext } from "./market_.$address.request.new";
import { FinalStep } from "~/features/service-request-creator/overview-fields";
import { findTokenBySymbol } from "~/services/tokens.server";
import { requireUser } from "~/services/session.server";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { notFound } from "remix-utils";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { EvmAddressSchema } from "~/domain/address";
import { findProjectsBySlug } from "~/services/projects.server";
import { z } from "zod";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketTokens = await findTokenBySymbol(laborMarket.appData.tokenAllowlist);

  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ address, laborMarketTokens, laborMarketProjects });
};

export default function ChallengeOverview() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketTokens, address, laborMarketProjects } = useTypedLoaderData<typeof loader>();
  return (
    <FinalStep
      tokens={laborMarketTokens}
      projects={laborMarketProjects}
      address={address}
      page1Data={formData?.page1Data}
      page2Data={formData?.page2Data}
      page3Data={formData?.page3Data}
    />
  );
}