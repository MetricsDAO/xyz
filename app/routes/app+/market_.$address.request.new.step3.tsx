import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { Step3Form } from "~/features/service-request-creator/schema";
import { Step3Fields } from "~/features/service-request-creator/step3-fields";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { EvmAddressSchema } from "~/domain/address";
import { z } from "zod";
import { findTokenBySymbol } from "~/services/tokens.server";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketTokens = await findTokenBySymbol(laborMarket.appData.tokenAllowlist);
  return typedjson({ address, laborMarketTokens });
};

export default function Step3Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketTokens, address } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <Step3Fields
        currentData={formData.page3Data}
        validTokens={laborMarketTokens}
        onDataUpdate={(data: Step3Form) => {
          setFormData((prevData) => ({ ...prevData, page3Data: data }));
        }}
        address={address}
      />
    </div>
  );
}
