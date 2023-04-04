import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { PermissionIcon } from "~/features/permission-icon";
import { useMarketAddressData } from "~/hooks/use-market-address-data";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useTokenData } from "~/hooks/use-token-data";
import { isUnlimitedSubmitRepMax } from "~/utils/helpers";

export default function MarketplaceIdPrerequesites() {
  const { laborMarket } = useMarketAddressData();

  const maintainerData = useTokenData(laborMarket.configuration.maintainerBadge);
  const delegateData = useTokenData(laborMarket.configuration.delegateBadge);

  const { canReview, canLaunchChallenges, canSubmit } = usePrereqs({ laborMarket });

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
                  <h3 className="font-medium mb-4">
                    You must hold this much rMETRIC to enter submissions on challenges
                  </h3>
                  <PermissionIcon isAllowed={canSubmit} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MIN BALANCE</div>
                    <Badge>
                      <div className="normal-case">{laborMarket.configuration.reputationParams.submitMin} rMETRIC</div>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MAX BALANCE</div>
                    {isUnlimitedSubmitRepMax(laborMarket) ? (
                      <Badge>Unlimited</Badge>
                    ) : (
                      <Badge>{laborMarket.configuration.reputationParams.submitMax} rMETRIC</Badge>
                    )}
                  </div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium mb-4">
                    You must hold this badge to review and score submissions on challenges
                  </h3>
                  <PermissionIcon isAllowed={canReview} />
                </div>
                <div className="text-xs text-gray-500">{maintainerData?.name}</div>
                <div className="flex gap-2 items-center">
                  <img src={maintainerData?.image} alt="" className="h-4 w-4" />
                  <p className="text-base text-[#252525]">{`${laborMarket.configuration.maintainerBadge.token} #${laborMarket.configuration.maintainerBadge.tokenId}`}</p>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium mb-4">You must hold this badge to launch new challenges</h3>
                  <PermissionIcon isAllowed={canLaunchChallenges} />
                </div>
                <div className="text-xs text-gray-500">{delegateData?.name}</div>
                <div className="flex gap-2 items-center">
                  <img src={delegateData?.image} alt="" className="h-4 w-4" />
                  <p className="text-base text-[#252525]">{`${laborMarket.configuration.delegateBadge.token} #${laborMarket.configuration.delegateBadge.tokenId}`}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
