import { useRouteData } from "remix-utils";
import invariant from "tiny-invariant";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import { useTokenData } from "~/hooks/use-token-data";
import type { findLaborMarket } from "~/services/labor-market.server";
import type { findServiceRequest } from "~/services/service-request.server";

export default function ServiceIdPrereqs() {
  const data = useRouteData<{
    serviceRequest: Awaited<ReturnType<typeof findServiceRequest>>;
    laborMarket: Awaited<ReturnType<typeof findLaborMarket>>;
  }>("routes/app/$mType/m/$laborMarketAddress.sr/$serviceRequestId");
  if (!data) {
    throw new Error("ServiceIdPrereqs must be rendered under a serviceId route");
  }

  const { laborMarket } = data;

  invariant(laborMarket, "No labormarket found");

  const maintainerData = useTokenData(laborMarket.configuration.maintainerBadge);

  return (
    <section>
      <p className="text-gray-500 text-sm mb-6">
        What you must hold in your connected wallet to perform various actions on this challenge
      </p>

      <div className="space-y-3">
        <Card className="p-5">
          <h3 className="font-medium mb-4">You must hold this much rMETRIC to enter submissions for this challenge</h3>
          <Detail>
            <DetailItem title="Min Balance">
              <Badge>{laborMarket.configuration.reputationParams.submitMin} rMETRIC</Badge>
            </DetailItem>
            <DetailItem title="Max Balance">
              <Badge>{laborMarket.configuration.reputationParams.submitMax} rMETRIC</Badge>
            </DetailItem>
          </Detail>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium mb-4">
            You must hold this badge to review and score submissions on this challenge
          </h3>
          <Detail>
            <DetailItem title={maintainerData?.name}>
              <div className="flex gap-2 items-center">
                <img src={maintainerData?.image} alt="" className="h-4 w-4" />
                <p className="text-base text-[#252525]">{`${laborMarket.configuration.maintainerBadge.token} #${laborMarket.configuration.maintainerBadge.tokenId}`}</p>
              </div>
            </DetailItem>
          </Detail>
        </Card>
      </div>
    </section>
  );
}
