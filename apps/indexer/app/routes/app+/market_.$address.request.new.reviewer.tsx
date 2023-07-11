import { useNavigate, useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import type { ReviewerForm as ReviewerFormType } from "~/features/service-request-creator/schema";
import { ReviewerForm } from "~/features/service-request-creator/reviewer-form";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { EvmAddressSchema } from "~/domain/address";
import { z } from "zod";
import { findTokenBySymbol } from "~/services/tokens.server";
import { FormStepper } from "~/components";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketTokens = await findTokenBySymbol(laborMarket.appData.tokenAllowlist);
  return typedjson({ address, laborMarketTokens });
};

export default function ReviewerPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketTokens, address } = useTypedLoaderData<typeof loader>();

  const navigate = useNavigate();

  const onNext = (values: ReviewerFormType) => {
    setFormData((prevData) => ({ ...prevData, reviewer: values }));
    navigate(`/app/market/${address}/request/new/overview`);
  };

  const onPrevious = (values: ReviewerFormType) => {
    setFormData((prevData) => ({ ...prevData, reviewer: values }));
    navigate(`/app/market/${address}/request/new/analyst`);
  };

  return (
    <div className="flex relative min-h-screen">
      <ReviewerForm
        defaultValues={formData.reviewer}
        validTokens={laborMarketTokens}
        onNext={onNext}
        onPrevious={onPrevious}
        address={address}
      />
      <aside className="w-1/5 py-28 ml-2 md:block hidden">
        <FormStepper step={3} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
