import { useTokenData } from "~/hooks/use-token-data";
import { Badge } from "../badge";
import { Detail, DetailItem } from "../detail";
import type { BadgeData } from "~/features/labor-market-creator/schema";

export function GatingBadge({ badge }: { badge: BadgeData }) {
  const extraData = useTokenData({ token: badge.contractAddress, tokenId: badge.tokenId.toString() });
  return (
    <Detail>
      <DetailItem title={extraData?.name}>
        <div className="flex gap-2 items-center">
          <img src={extraData?.image} alt="" className="h-4 w-4" />
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
  );
}
