import { useRouteData } from "remix-utils";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Detail, DetailItem } from "~/components/detail";
import type { findServiceRequest } from "~/services/service-request.server";

export default function ServiceIdPrereqs() {
  const data = useRouteData<{ serviceRequest: Awaited<ReturnType<typeof findServiceRequest>> }>(
    "routes/app/$mType/m/$laborMarketAddress.sr/$serviceRequestId"
  );
  if (!data) {
    throw new Error("ServiceIdPrereqs must be rendered under a serviceId route");
  }
  const { serviceRequest } = data;

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
              <Badge>{serviceRequest?.laborMarket.submitRepMin} rMETRIC</Badge>
            </DetailItem>
            <DetailItem title="Max Balance">
              <Badge>{serviceRequest?.laborMarket.submitRepMax} rMETRIC</Badge>
            </DetailItem>
          </Detail>
        </Card>

        <Card className="p-5">
          <h3 className="font-medium mb-4">
            You must hold this badge to review and score submissions on this challenge
          </h3>
          <Detail>
            <DetailItem title="MDAO S4 Reviewer Badge">
              <Badge className="pl-2 flex space-x-1">
                <Avatar />
                <span>{serviceRequest?.laborMarket.reviewBadgerAddress}</span>
              </Badge>
            </DetailItem>
          </Detail>
        </Card>
      </div>
    </section>
  );
}
