import { useRouteData } from "remix-utils";
import invariant from "tiny-invariant";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import type { getLaborMarket } from "~/domain/labor-market/functions.server";
import { PermissionIcon } from "~/features/permission-icon";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useTokenData } from "~/hooks/use-token-data";
import type { findServiceRequest } from "~/domain/service-request/functions.server";
import { isUnlimitedSubmitRepMax } from "~/utils/helpers";

export default function ServiceIdPrereqs() {
  const data = useRouteData<{
    serviceRequest: Awaited<ReturnType<typeof findServiceRequest>>;
    laborMarket: Awaited<ReturnType<typeof getLaborMarket>>;
  }>("routes/app+/market_.$address.request.$requestId");
  if (!data) {
    throw new Error("ServiceIdPrereqs must be rendered under a serviceId route");
  }

  const { laborMarket } = data;

  invariant(laborMarket, "No labormarket found");

  //const maintainerData = useTokenData(laborMarket.configuration.maintainerBadge);

  const { canSubmit, canReview } = usePrereqs({ laborMarket });

  return (
    <section>
      <p className="text-gray-500 text-sm mb-6">
        What you must hold in your connected wallet to perform various actions on this challenge
      </p>

      <div className="space-y-3">
        <Card className="p-5">
          <div className="flex justify-between">
            <h3 className="font-medium mb-4">Make Submissions</h3>
            <PermissionIcon isAllowed={canSubmit} />
          </div>
          {laborMarket.appData.prerequisites?.analyst.numberBadgesRequired && (
            <p className="text-gray-500 text-sm mb-6">
              You must have at least {laborMarket.appData.prerequisites?.analyst.numberBadgesRequired} badge(s)
            </p>
          )}
          {laborMarket.appData.prerequisites?.analyst.gatingType === "All" && (
            <p className="text-gray-500 text-sm mb-6">You must have all the following badges</p>
          )}
          {laborMarket.appData.prerequisites?.analyst.gatingType === "Anyone" ? (
            <p>Anyone can!</p>
          ) : (
            <>
              {laborMarket?.appData.prerequisites?.analyst.badges.map((badge) => (
                <Detail key={`${badge.contractAddress}_${badge.tokenId}`}>
                  <DetailItem title={badge.contractAddress}>
                    <div className="flex gap-2 items-center">
                      <img src={"maintainerData?.image"} alt="" className="h-4 w-4" />
                      <p className="text-base text-[#252525]">{`${badge.contractAddress} #${badge.tokenId}`}</p>
                    </div>
                  </DetailItem>
                  <DetailItem title="Min Balance">
                    <Badge>{badge.minBadgeBalance}</Badge>
                  </DetailItem>
                  <DetailItem title="Max Balance">
                    {badge.maxBadgeBalance ? <Badge>{badge.maxBadgeBalance}</Badge> : <Badge>Unlimited</Badge>}
                  </DetailItem>
                </Detail>
              ))}
            </>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex justify-between">
            <h3 className="font-medium mb-4">Review Submissions</h3>
            <PermissionIcon isAllowed={canReview} />
          </div>
          {laborMarket.appData.prerequisites?.reviewer.numberBadgesRequired && (
            <p className="text-gray-500 text-sm mb-6">
              You must have at least {laborMarket.appData.prerequisites?.reviewer.numberBadgesRequired} badge(s)
            </p>
          )}
          {laborMarket.appData.prerequisites?.reviewer.gatingType === "All" && (
            <p className="text-gray-500 text-sm mb-6">You must have all the following badges</p>
          )}
          {laborMarket.appData.prerequisites?.reviewer.gatingType === "Anyone" ? (
            <p>Anyone can!</p>
          ) : (
            <>
              {laborMarket.appData.prerequisites?.reviewer.badges.map((badge) => (
                <Detail key={`${badge.contractAddress}_${badge.tokenId}`}>
                  <DetailItem title={badge.contractAddress}>
                    <div className="flex gap-2 items-center">
                      <img src={"maintainerData?.image"} alt="" className="h-4 w-4" />
                      <p className="text-base text-[#252525]">{`${badge.contractAddress} #${badge.tokenId}`}</p>
                    </div>
                  </DetailItem>
                  <DetailItem title="Min Balance">
                    <Badge>{badge.minBadgeBalance}</Badge>
                  </DetailItem>
                  <DetailItem title="Max Balance">
                    {badge.maxBadgeBalance ? <Badge>{badge.maxBadgeBalance}</Badge> : <Badge>Unlimited</Badge>}
                  </DetailItem>
                </Detail>
              ))}
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
