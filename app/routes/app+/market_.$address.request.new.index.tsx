import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { AppDataFields } from "~/features/service-request-creator/app-data-fields";
import type { AppDataForm } from "~/features/service-request-creator/schema";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
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
  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ address, laborMarketProjects });
};

export default function AppDataPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketProjects, address } = useTypedLoaderData<typeof loader>();
  return (
    <AppDataFields
      currentData={formData.page1Data}
      projects={laborMarketProjects}
      onDataUpdate={(data: AppDataForm) => {
        setFormData((prevData) => ({ ...prevData, page1Data: data }));
      }}
      address={address}
    />
  );
}
