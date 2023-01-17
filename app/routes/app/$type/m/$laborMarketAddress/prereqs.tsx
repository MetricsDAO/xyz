import { useRouteData } from "remix-utils";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import type { findLaborMarket } from "~/services/labor-market.server";

export default function MarketplaceIdPrerequesites() {
  const data = useRouteData<{ laborMarket: Awaited<ReturnType<typeof findLaborMarket>> }>(
    "routes/app/$type/m/$laborMarketAddress"
  );
  if (!data) {
    throw new Error("MarketplaceIdPrerequesites must be rendered under a MarketplaceId route");
  }
  const { laborMarket } = data;
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate">
            <div className="space-y-4 md:w-4/5">
              <p className="text-sm text-gray-500">
                What you must hold in your connected wallet to perform various actions on challenges in this challenge
                marketplace
              </p>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this much rMETRIC to enter submissions on challenges
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MIN BALANCE</div>
                    <Badge>
                      <div className="normal-case">{laborMarket?.submitRepMin} rMETRIC</div>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MAX BALANCE</div>
                    <Badge>
                      <div className="normal-case">{laborMarket?.submitRepMax} rMETRIC</div>
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to review and score submissions on challenges
                </p>
                <div className="text-xs text-gray-500">MDAO S4 REVIEWER BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">{laborMarket?.reviewBadgerAddress}</div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to launch new challenges
                </p>
                <div className="text-xs text-gray-500">MDAO S4 CONTRIBUTOR BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">{laborMarket?.launchBadgerAddress}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
