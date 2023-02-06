import { Link, Outlet, useParams } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { badRequest, notFound } from "remix-utils";
import { z } from "zod";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { findServiceRequest } from "~/services/service-request.server";

import { $path } from "remix-routes";
import invariant from "tiny-invariant";
import { UserBadge } from "~/components";
import { RewardBadge } from "~/components/reward-badge";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ProjectBadges } from "~/features/project-badges";
import { useHasPerformed } from "~/hooks/use-has-claimed";
import { findLaborMarket } from "~/services/labor-market.server";
import { findProjectsBySlug } from "~/services/projects.server";
import { dateHasPassed } from "~/utils/date";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { laborMarketAddress, serviceRequestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  if (!serviceRequest) {
    throw notFound({ serviceRequestId });
  }
  const laborMarket = await findLaborMarket(laborMarketAddress);
  if (!laborMarket) {
    throw notFound({ laborMarket });
  }

  if (!serviceRequest.appData) {
    throw badRequest("Labor market app data is missing");
  }

  const serviceRequestProjects = await findProjectsBySlug(serviceRequest.appData.projectSlugs);

  // const submissionIds = serviceRequest.submissions.map((s) => s.contractId);
  const numOfReviews = 0;
  return typedjson({ serviceRequest, numOfReviews, laborMarket, serviceRequestProjects }, { status: 200 });
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews, serviceRequestProjects, laborMarket } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  const hasClaimedToSubmit = useHasPerformed({
    laborMarketAddress: serviceRequest.address as `0x${string}`,
    serviceRequestId: serviceRequest.id,
    action: "HAS_CLAIMED",
  });

  const hasSubmitted = useHasPerformed({
    laborMarketAddress: serviceRequest.address as `0x${string}`,
    serviceRequestId: serviceRequest.id,
    action: "HAS_SUBMITTED",
  });

  return (
    <Container className="py-16 px-10">
      <header className="flex flex-wrap gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold">{serviceRequest.appData?.title}</h1>
        <div className="flex flex-wrap gap-5">
          <Button variant="cancel" size="lg" asChild>
            <ConnectWalletWrapper>
              <Button size="lg" asChild>
                <Link
                  to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/review", {
                    mType: mType,
                    laborMarketAddress: serviceRequest.address,
                    serviceRequestId: serviceRequest.id,
                  })}
                >
                  Claim to Review
                </Link>
              </Button>
            </ConnectWalletWrapper>
          </Button>
          {!hasClaimedToSubmit && !hasSubmitted && (
            <Button variant="primary" size="lg" asChild>
              <ConnectWalletWrapper>
                <Button size="lg" asChild>
                  <Link
                    to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/claim", {
                      mType: mType,
                      laborMarketAddress: serviceRequest.address,
                      serviceRequestId: serviceRequest.id,
                    })}
                  >
                    Claim to Submit
                  </Link>
                </Button>
              </ConnectWalletWrapper>
            </Button>
          )}
          <Button variant="primary" size="lg" asChild>
            {hasClaimedToSubmit && (
              <ConnectWalletWrapper>
                <Button size="lg" asChild>
                  <Link
                    to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/submit", {
                      mType: mType,
                      laborMarketAddress: serviceRequest.address,
                      serviceRequestId: serviceRequest.id,
                    })}
                  >
                    Submit
                  </Link>
                </Button>
              </ConnectWalletWrapper>
            )}
          </Button>
        </div>
      </header>
      <Detail className="mb-6 flex flex-wrap gap-y-2">
        <DetailItem title="Sponsor">
          <UserBadge url="u/id" address={laborMarket.configuration.owner as `0x${string}`} balance={200} />
        </DetailItem>
        <div className="flex space-x-4">
          {serviceRequestProjects && (
            <DetailItem title="Chain/Project">{<ProjectBadges projects={serviceRequestProjects} />}</DetailItem>
          )}
        </div>
        <DetailItem title="Reward Pool">
          <RewardBadge amount={100} token="SOL" rMETRIC={5000} />
        </DetailItem>
        <DetailItem title="Submissions">
          <Badge className="px-4 min-w-full">{serviceRequest.submissionCount}</Badge>
        </DetailItem>
        <DetailItem title="Reviews">
          <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
        </DetailItem>
        <DetailItem title="Winner">
          {!dateHasPassed(serviceRequest.configuration.enforcementExpiration) ? (
            <Badge>Pending</Badge>
          ) : (
            <Badge>todo</Badge>
          )}
        </DetailItem>
      </Detail>

      <article className="text-gray-500 text-sm mb-20 max-w-2xl">
        <p>{serviceRequest.appData?.description}</p>
      </article>

      <TabNav className="mb-10">
        <TabNavLink to="" end>
          Submissions <span className="text-gray-400">{serviceRequest.submissionCount}</span>
        </TabNavLink>
        <TabNavLink to="./prereqs">Prerequisites</TabNavLink>
        <TabNavLink to="./rewards">Rewards</TabNavLink>
        <TabNavLink to="./timeline">Timeline &amp; Deadlines</TabNavLink>
        <TabNavLink to="./participants">
          Participants <span className="text-gray-400">(99)</span>
        </TabNavLink>
      </TabNav>

      <Outlet />
    </Container>
  );
}
