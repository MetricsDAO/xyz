import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import type { AnalystForm } from "~/features/service-request-creator/schema";
import { AnalystFields } from "~/features/service-request-creator/analyst-fields";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { EvmAddressSchema } from "~/domain/address";
import { z } from "zod";
import { findTokenBySymbol } from "~/services/tokens.server";

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

export default function AnalystPage() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketTokens, address } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <AnalystFields
        currentData={formData.page2Data}
        validTokens={laborMarketTokens}
        onDataUpdate={(data: AnalystForm) => {
          setFormData((prevData) => ({ ...prevData, page2Data: data }));
        }}
        address={address}
      />
    </div>
  );
}
