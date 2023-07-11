import { useNavigate, useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { AppDataForm } from "~/features/service-request-creator/app-data-form";
import type { AppDataForm as AppDataFormType } from "~/features/service-request-creator/schema";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { EvmAddressSchema } from "~/domain/address";
import { findProjectsBySlug } from "~/services/projects.server";
import { z } from "zod";
import { FormStepper } from "~/components";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ address, laborMarketProjects });
};

export default function AppDataPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketProjects, address } = useTypedLoaderData<typeof loader>();

  const navigate = useNavigate();

  const onNext = (values: AppDataFormType) => {
    setFormData((prevData) => ({ ...prevData, appData: values }));
    navigate(`/app/market/${address}/request/new/analyst`);
  };

  return (
    <div className="flex relative min-h-screen">
      <AppDataForm defaultValues={formData.appData} projects={laborMarketProjects} onNext={onNext} address={address} />
      <aside className="w-1/5 py-28 ml-2 md:block hidden">
        <FormStepper step={1} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
