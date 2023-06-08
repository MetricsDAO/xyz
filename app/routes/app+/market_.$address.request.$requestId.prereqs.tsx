import { useRouteData } from "remix-utils";
import invariant from "tiny-invariant";
import { Card } from "~/components/card";
import type { getLaborMarket } from "~/domain/labor-market/functions.server";
import { PermissionIcon } from "~/features/permission-icon";
import { usePrereqs } from "~/hooks/use-prereqs";
import type { findServiceRequest } from "~/domain/service-request/functions.server";
import { GatingBadge } from "~/components";

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
                <div key={`${badge.contractAddress}_${badge.tokenId}`}>
                  <GatingBadge badge={badge} />
                </div>
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
                <div key={`${badge.contractAddress}_${badge.tokenId}`}>
                  <GatingBadge badge={badge} />
                </div>
              ))}
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
