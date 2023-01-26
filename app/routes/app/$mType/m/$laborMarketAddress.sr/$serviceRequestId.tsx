import { Link, Outlet, useParams } from "@remix-run/react";
import { Detail, DetailItem } from "~/components/detail";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { findServiceRequest } from "~/services/service-request.server";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { Container } from "~/components/container";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { ProjectAvatar } from "~/components/avatar";
import { countReviews } from "~/services/review-service.server";
import { RewardBadge } from "~/components/reward-badge";
import { dateHasPassed } from "~/utils/date";
import { $path } from "remix-routes";
import invariant from "tiny-invariant";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { laborMarketAddress, serviceRequestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  if (!serviceRequest) {
    throw notFound({ serviceRequestId });
  }

  const submissionIds = serviceRequest.submissions.map((s) => s.contractId);
  const numOfReviews = await countReviews(submissionIds);
  return typedjson({ serviceRequest, numOfReviews }, { status: 200 });
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  return (
    <Container className="py-16 px-10">
      <header className="flex flex-wrap gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold">{serviceRequest.title}</h1>
        <div className="flex flex-wrap gap-5">
          <Button variant="cancel" size="lg" asChild>
            <Link
              to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/review", {
                mType: mType,
                laborMarketAddress: serviceRequest.laborMarketAddress,
                serviceRequestId: serviceRequest.contractId,
              })}
            >
              Claim to Review
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link
              to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/claim", {
                mType: mType,
                laborMarketAddress: serviceRequest.laborMarketAddress,
                serviceRequestId: serviceRequest.contractId,
              })}
            >
              Claim to Submit
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link
              to={$path("/app/:mType/m/:laborMarketAddress/sr/:serviceRequestId/submit", {
                mType: mType,
                laborMarketAddress: serviceRequest.laborMarketAddress,
                serviceRequestId: serviceRequest.contractId,
              })}
            >
              Submit
            </Link>
          </Button>
        </div>
      </header>
      <Detail className="mb-6 flex flex-wrap gap-y-2">
        <DetailItem title="Sponsor">
          {/*<UserBadge url="u/id" address={serviceRequest.laborMarket.sponsorAddress as `0x${string}`} balance={200} />*/}
        </DetailItem>
        <DetailItem title="Chain/Project">
          <div className="flex space-x-4">
            {serviceRequest.laborMarket.projects.map((p) => (
              <Badge key={p.slug} className="pl-2">
                <ProjectAvatar project={p} />
                <span className="mx-1">{p.name}</span>
              </Badge>
            ))}
          </div>
        </DetailItem>
        <DetailItem title="Reward Pool">
          <RewardBadge amount={100} token="SOL" rMETRIC={5000} />
        </DetailItem>
        <DetailItem title="Submissions">
          <Badge className="px-4 min-w-full">{serviceRequest._count.submissions}</Badge>
        </DetailItem>
        <DetailItem title="Reviews">
          <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
        </DetailItem>
        <DetailItem title="Winner">
          {!dateHasPassed(serviceRequest.enforcementExpiration) ? <Badge>Pending</Badge> : <Badge>todo</Badge>}
        </DetailItem>
      </Detail>

      <article className="text-gray-500 text-sm mb-20 max-w-2xl">
        <p>{serviceRequest.description}</p>
      </article>

      <TabNav className="mb-10">
        <TabNavLink to="" end>
          Submissions <span className="text-gray-400">({serviceRequest._count.submissions})</span>
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
