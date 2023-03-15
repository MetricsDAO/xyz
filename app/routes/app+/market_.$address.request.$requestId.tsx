import { Link, Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { badRequest, ClientOnly, notFound } from "remix-utils";
import { z } from "zod";
import { UserBadge } from "~/components";
import { Badge } from "~/components/badge";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { RewardBadge } from "~/components/reward-badge";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ParsedMarkdown } from "~/components/markdown-editor/markdown.client";
import { ProjectBadges } from "~/features/project-badges";
import { WalletGuardedButtonLink } from "~/features/wallet-guarded-button-link";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { useReputationTokenBalance } from "~/hooks/use-reputation-token-balance";
import { useReviewSignals } from "~/hooks/use-review-signals";
import { useTokenBalance } from "~/hooks/use-token-balance";
import { useOptionalUser } from "~/hooks/use-user";
import { findProjectsBySlug } from "~/services/projects.server";
import { countReviews } from "~/services/review-service.server";
import { findServiceRequest } from "~/services/service-request.server";
import { listTokens } from "~/services/tokens.server";
import { REPUTATION_REWARD_POOL } from "~/utils/constants";
import { dateHasPassed } from "~/utils/date";
import { claimToReviewDeadline, fromTokenAmount } from "~/utils/helpers";
import * as DOMPurify from "dompurify";

const paramsSchema = z.object({ address: z.string(), requestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  if (!serviceRequest) {
    throw notFound({ requestId });
  }
  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound({ laborMarket });
  }

  if (!serviceRequest.appData) {
    throw badRequest("Labor market app data is missing");
  }

  const serviceRequestProjects = await findProjectsBySlug(serviceRequest.appData.projectSlugs);
  const tokens = await listTokens();

  const numOfReviews = await countReviews({ laborMarketAddress: address, serviceRequestId: requestId });
  return typedjson({ serviceRequest, numOfReviews, laborMarket, serviceRequestProjects, tokens }, { status: 200 });
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews, serviceRequestProjects, laborMarket, tokens } =
    useTypedLoaderData<typeof loader>();

  const claimDeadlinePassed = dateHasPassed(serviceRequest.configuration.signalExpiration);
  const claimToReviewDeadlinePassed = dateHasPassed(claimToReviewDeadline(serviceRequest));

  const token = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pToken);

  const description = serviceRequest.appData?.description ? serviceRequest.appData.description : "";

  const hasClaimedToSubmit = useHasPerformed({
    laborMarketAddress: serviceRequest.laborMarketAddress as `0x${string}`,
    id: serviceRequest.id,
    action: "HAS_SIGNALED",
  });

  const hasSubmitted = useHasPerformed({
    laborMarketAddress: serviceRequest.laborMarketAddress as `0x${string}`,
    id: serviceRequest.id,
    action: "HAS_SUBMITTED",
  });

  const maintainerBadgeTokenBalance = useTokenBalance({
    tokenAddress: laborMarket.configuration.maintainerBadge.token as `0x${string}`,
    tokenId: laborMarket.configuration.maintainerBadge.tokenId,
  });

  const reviewSignal = useReviewSignals({
    laborMarketAddress: serviceRequest.laborMarketAddress as `0x${string}`,
    serviceRequestId: serviceRequest.id,
  });

  const reputationBalance = useReputationTokenBalance();

  const user = useOptionalUser();
  const userSignedIn = !!user;

  const showSubmit = hasClaimedToSubmit && !hasSubmitted;
  const canClaimToSubmit =
    reputationBalance?.gte(laborMarket.configuration.reputationParams.submitMin) &&
    reputationBalance?.lte(laborMarket.configuration.reputationParams.submitMax);
  const showClaimToSubmit = !hasClaimedToSubmit && !hasSubmitted && !claimDeadlinePassed;
  const showClaimToReview =
    reviewSignal?.remainder.eq(0) && // Must not have any remaining reviews left (or initial of 0)
    !claimToReviewDeadlinePassed;

  const canClaimToReview = maintainerBadgeTokenBalance?.gt(0);

  return (
    <Container className="pt-7 pb-16 px-10">
      <Breadcrumbs
        crumbs={[
          { link: `/app/${laborMarket.appData?.type}`, name: "Marketplaces" },
          { link: `/app/market/${laborMarket.address}`, name: laborMarket.appData?.title ?? "" },
        ]}
      />
      <header className="flex flex-wrap gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold">{serviceRequest.appData?.title}</h1>
        <div className="flex flex-wrap gap-5">
          {showClaimToReview && (
            <WalletGuardedButtonLink
              buttonText="Claim to Review"
              link={`/app/market/${laborMarket.address}/request/${serviceRequest.id}/review`}
              disabled={userSignedIn && !canClaimToReview}
              disabledTooltip="Check for Prerequisites"
              variant="cancel"
              size="lg"
            />
          )}
          {showClaimToSubmit && (
            <WalletGuardedButtonLink
              buttonText="Claim to Submit"
              link={`/app/market/${laborMarket.address}/request/${serviceRequest.id}/claim`}
              disabled={userSignedIn && !canClaimToSubmit}
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
            <UserBadge address={laborMarket.configuration.owner as `0x${string}`} />
          </DetailItem>
          <div className="flex space-x-4">
            {serviceRequestProjects && (
              <DetailItem title="Chain/Project">{<ProjectBadges projects={serviceRequestProjects} />}</DetailItem>
            )}
          </div>
          <DetailItem title="Reward Pool">
            <RewardBadge
              amount={fromTokenAmount(serviceRequest.configuration.pTokenQuantity)}
              token={token?.symbol ?? ""}
              rMETRIC={REPUTATION_REWARD_POOL}
            />
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

        <ClientOnly>{() => <ParsedMarkdown text={DOMPurify.sanitize(description)} />}</ClientOnly>
      </section>

      <TabNav className="mb-10">
        <TabNavLink to="" end>
          Submissions <span className="text-gray-400">{serviceRequest.submissionCount}</span>
        </TabNavLink>
        <TabNavLink to="./prereqs">Prerequisites</TabNavLink>
        <TabNavLink to="./rewards">Rewards</TabNavLink>
        <TabNavLink to="./timeline">Timeline &amp; Deadlines</TabNavLink>
        {/* MVP Hide */}
        {/* <TabNavLink to="./participants">
          Participants <span className="text-gray-400">(99)</span>
        </TabNavLink> */}
      </TabNav>

      <Outlet />
    </Container>
  );
}
