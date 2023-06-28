import { Link, Outlet, useMatches } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import * as DOMPurify from "dompurify";
import { useState } from "react";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ClientOnly, notFound } from "remix-utils";
import { z } from "zod";
import { UserBadge } from "~/components";
import { Badge } from "~/components/badge";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { ParsedMarkdown } from "~/components/markdown-editor/markdown.client";
import { RewardBadge } from "~/components/reward-badge";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { EvmAddressSchema } from "~/domain/address";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { countReviews } from "~/domain/review/functions.server";
import { getServiceRequest } from "~/domain/service-request/functions.server";
import { uniqueParticipants } from "~/domain/user-activity/function.server";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import DeleteServiceRequestModal from "~/features/delete-service-request";
import { ProjectBadges } from "~/features/project-badges";
import { WalletGuardedButtonLink } from "~/features/wallet-guarded-button-link";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useTokens } from "~/hooks/use-root-data";
import { useServiceRequestPerformance } from "~/hooks/use-service-request-performance";
import { useOptionalUser } from "~/hooks/use-user";
import { findProjectsBySlug } from "~/services/projects.server";
import { REPUTATION_REWARD_POOL } from "~/utils/constants";
import { dateHasPassed } from "~/utils/date";
import { claimToReviewDeadline, fromTokenAmount } from "~/utils/helpers";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);

  const serviceRequest = await getServiceRequest(address, requestId);
  if (!serviceRequest) {
    throw notFound({ requestId });
  }
  const laborMarket = await getLaborMarket(address);
  if (!laborMarket) {
    throw notFound({ laborMarket });
  }

  const serviceRequestProjects = await findProjectsBySlug(serviceRequest.appData.projectSlugs);

  const numOfReviews = await countReviews({
    laborMarketAddress: address,
    serviceRequestId: requestId,
  });

  const participants = await uniqueParticipants({
    requestId: serviceRequest.id,
    laborMarketAddress: laborMarket.address,
  });
  const numParticipants = participants.length;
  return typedjson(
    { serviceRequest, numOfReviews, laborMarket, serviceRequestProjects, numParticipants },
    { status: 200 }
  );
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews, serviceRequestProjects, laborMarket, numParticipants } =
    useTypedLoaderData<typeof loader>();

  const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(false);

  const user = useOptionalUser();
  const userSignedIn = !!user;
  const tokens = useTokens();

  const claimDeadlinePassed = dateHasPassed(serviceRequest.configuration.signalExp);
  const claimToReviewDeadlinePassed = dateHasPassed(claimToReviewDeadline(serviceRequest));

  const token = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenProvider);

  const performance = useServiceRequestPerformance({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    serviceRequestId: serviceRequest.id,
  });
  const claimedReviews = serviceRequest.indexData.claimsToReview.reduce((sum, claim) => sum + claim.signalAmount, 0);

  const showSubmit = performance?.signaled && !performance.submitted;
  const showClaimToSubmit = !performance?.signaled && !performance?.submitted && !claimDeadlinePassed;
  const showClaimToReview =
    !performance?.remainingReviews &&
    !claimToReviewDeadlinePassed &&
    claimedReviews < serviceRequest.configuration.reviewerLimit;

  const { canReview, canSubmit } = usePrereqs({ laborMarket });

  const showDelete =
    user &&
    user.address === serviceRequest.configuration.requester &&
    serviceRequest.indexData.claimsToReview.length === 0 &&
    serviceRequest.indexData.claimsToSubmit.length === 0;

  return (
    <Container className={`h-full w-full pt-7 pb-16 px-10 ${sidePanelOpen ? "w-1/2 static ml-0" : ""}`}>
      <Breadcrumbs crumbs={[{ link: `/app/market/${laborMarket.address}`, name: laborMarket.appData?.title ?? "" }]} />
      <header className="flex flex-col md:flex-row gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold md:basis-2/3">{serviceRequest.appData?.title}</h1>
        <div className="flex flex-wrap gap-5 md:basis-1/3 justify-end">
          {showDelete && <DeleteServiceRequestModal serviceRequest={serviceRequest} />}
          {showClaimToReview && (
            <WalletGuardedButtonLink
              buttonText="Claim to Review"
              link={`/app/market/${laborMarket.address}/request/${serviceRequest.id}/review`}
              disabled={userSignedIn && !canReview}
              disabledTooltip="Check for Prerequisites"
              variant="cancel"
              size="lg"
            />
          )}
          {showClaimToSubmit && (
            <WalletGuardedButtonLink
              buttonText="Claim to Submit"
              link={`/app/market/${laborMarket.address}/request/${serviceRequest.id}/claim`}
              disabled={userSignedIn && !canSubmit}
              disabledTooltip="Check for Prerequisites"
              size="lg"
            />
          )}
          <Button variant="primary" size="lg" asChild>
            {showSubmit && (
              <ConnectWalletWrapper>
                <Button size="lg" asChild>
                  <Link to={`/app/market/${laborMarket.address}/request/${serviceRequest.id}/submit`}>Submit</Link>
                </Button>
              </ConnectWalletWrapper>
            )}
          </Button>
        </div>
      </header>
      <section className="flex flex-col space-y-7 pb-12">
        <Detail className="mb-6 flex flex-wrap gap-y-2">
          <DetailItem title="Sponsor">
            <UserBadge address={laborMarket.configuration.deployer} />
          </DetailItem>
          <div className="flex space-x-4">
            {serviceRequestProjects && (
              <DetailItem title="Chain/Project">{<ProjectBadges projects={serviceRequestProjects} />}</DetailItem>
            )}
          </div>
          <DetailItem title="Reward Pool">
            <RewardBadge
              payment={{
                amount: fromTokenAmount(serviceRequest.configuration.pTokenProviderTotal, token?.decimals ?? 18),
                token,
              }}
              reputation={{ amount: REPUTATION_REWARD_POOL.toLocaleString() }}
            />
          </DetailItem>
          <DetailItem title="Submissions">
            <Badge className="px-4 min-w-full">{serviceRequest.indexData.submissionCount}</Badge>
          </DetailItem>
          <DetailItem title="Reviews">
            <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
          </DetailItem>
          <DetailItem title="Participants">
            <Badge className="px-4 min-w-full">{numParticipants}</Badge>
          </DetailItem>
        </Detail>

        <ClientOnly>
          {() => <ParsedMarkdown text={DOMPurify.sanitize(serviceRequest.appData.description)} />}
        </ClientOnly>
      </section>

      <TabNav className="mb-10">
        <TabNavLink to="./#tabNav" end>
          Submissions <span className="text-gray-400">({serviceRequest.indexData.submissionCount})</span>
        </TabNavLink>
        <TabNavLink to="./prereqs#tabNav">Prerequisites</TabNavLink>
        <TabNavLink to="./rewards#tabNav">Rewards</TabNavLink>
        <TabNavLink to="./timeline#tabNav">Timeline &amp; Deadlines</TabNavLink>
        <TabNavLink to="./participants#tabNav">Participants</TabNavLink>
      </TabNav>
      <Outlet context={[sidePanelOpen, setSidePanelOpen]} />
    </Container>
  );
}
