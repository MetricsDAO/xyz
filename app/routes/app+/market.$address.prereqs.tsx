import { GatingBadge } from "~/components";
import { Card } from "~/components/card";
import { PermissionIcon } from "~/features/permission-icon";
import { useMarketAddressData } from "~/hooks/use-market-address-data";
import { usePrereqs } from "~/hooks/use-prereqs";

export default function MarketplaceIdPrerequesites() {
  const { laborMarket } = useMarketAddressData();

  const { canLaunchChallenges, canSubmit, canReview } = usePrereqs({ laborMarket });

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
                <div className="flex justify-between">
                  <h3 className="font-medium mb-4">Make Submissions on Challenges</h3>
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
                  <p className="text-gray-500 text-sm">Anyone can!</p>
                ) : (
                  <>
                    {laborMarket.appData.prerequisites?.analyst.badges.map((badge) => (
                      <div key={`${badge.contractAddress}_${badge.tokenId}`}>
                        <GatingBadge badge={badge} />
                      </div>
                    ))}
                  </>
                )}
              </Card>
              <Card className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium mb-4">Review and Score Submissions on Challenges</h3>
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
                  <p className="text-gray-500 text-sm">Anyone can!</p>
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
              <Card className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium mb-4">You must hold this badge to launch new challenges</h3>
                  <PermissionIcon isAllowed={canLaunchChallenges} />
                </div>
                {laborMarket.appData.prerequisites?.sponsor.numberBadgesRequired && (
                  <p className="text-gray-500 text-sm mb-6">
                    You must have at least {laborMarket.appData.prerequisites?.sponsor.numberBadgesRequired} badge(s)
                  </p>
                )}
                {laborMarket.appData.prerequisites?.sponsor.gatingType === "All" && (
                  <p className="text-gray-500 text-sm mb-6">You must have all the following badges</p>
                )}
                {laborMarket.appData.prerequisites?.sponsor.gatingType === "Anyone" ? (
                  <p className="text-gray-500 text-sm">Anyone can!</p>
                ) : (
                  <>
                    {laborMarket.appData.prerequisites?.sponsor.badges.map((badge) => (
                      <div key={`${badge.contractAddress}_${badge.tokenId}`}>
                        <GatingBadge badge={badge} />
                      </div>
                    ))}
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
