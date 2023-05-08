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
import { getIndexedServiceRequest } from "~/domain/service-request/functions.server";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ParsedMarkdown } from "~/components/markdown-editor/markdown.client";
import { ProjectBadges } from "~/features/project-badges";
import { WalletGuardedButtonLink } from "~/features/wallet-guarded-button-link";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { useReviewSignals } from "~/hooks/use-review-signals";
import { useOptionalUser } from "~/hooks/use-user";
import { findProjectsBySlug } from "~/services/projects.server";
import { countReviews } from "~/domain/review/functions.server";
import { listTokens } from "~/services/tokens.server";
import { REPUTATION_REWARD_POOL } from "~/utils/constants";
import { dateHasPassed } from "~/utils/date";
import { claimToReviewDeadline, fromTokenAmount } from "~/utils/helpers";
import * as DOMPurify from "dompurify";
import { usePrereqs } from "~/hooks/use-prereqs";
import { EvmAddressSchema } from "~/domain/address";
import { uniqueParticipants } from "~/domain/user-activity/function.server";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);

  const serviceRequest = await getIndexedServiceRequest(address, requestId);
  if (!serviceRequest) {
    throw notFound({ requestId });
  }
  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound({ laborMarket });
  }

  if (!serviceRequest.appData) {
    throw badRequest("service request app data is missing");
  }

  const serviceRequestProjects = await findProjectsBySlug(serviceRequest.appData.projectSlugs);
  const tokens = await listTokens();

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
    { serviceRequest, numOfReviews, laborMarket, serviceRequestProjects, tokens, numParticipants },
    { status: 200 }
  );
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews, serviceRequestProjects, laborMarket, tokens, numParticipants } =
    useTypedLoaderData<typeof loader>();

  const claimDeadlinePassed = dateHasPassed(serviceRequest.configuration.signalExp);
  const claimToReviewDeadlinePassed = dateHasPassed(claimToReviewDeadline(serviceRequest));

  const token = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pToken);

  const description = serviceRequest.appData?.description ? serviceRequest.appData.description : "";

  const hasClaimedToSubmit = useHasPerformed({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    id: serviceRequest.id,
    action: "HAS_SIGNALED",
  });

  const hasSubmitted = useHasPerformed({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    id: serviceRequest.id,
    action: "HAS_SUBMITTED",
  });

  const reviewSignal = useReviewSignals({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    serviceRequestId: serviceRequest.id,
  });

  const user = useOptionalUser();
  const userSignedIn = !!user;

  const showSubmit = hasClaimedToSubmit && !hasSubmitted;
  const showClaimToSubmit = !hasClaimedToSubmit && !hasSubmitted && !claimDeadlinePassed;
  const showClaimToReview =
    reviewSignal?.remainder.eq(0) && // Must not have any remaining reviews left (or initial of 0)
    !claimToReviewDeadlinePassed;

  const { canReview, canSubmit } = usePrereqs({ laborMarket });

  return (
    <Container className="pt-7 pb-16 px-10">
      <Breadcrumbs
        crumbs={[
          { link: `/app/analyze`, name: "Marketplaces" },
          { link: `/app/market/${laborMarket.address}`, name: laborMarket.appData?.title ?? "" },
        ]}
      />
      <header className="flex flex-col md:flex-row gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold md:basis-2/3">{serviceRequest.appData?.title}</h1>
        <div className="flex flex-wrap gap-5 md:basis-1/3 justify-end">
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
            <UserBadge address={laborMarket.configuration.owner} />
          </DetailItem>
          <div className="flex space-x-4">
            {serviceRequestProjects && (
              <DetailItem title="Chain/Project">{<ProjectBadges projects={serviceRequestProjects} />}</DetailItem>
            )}
          </div>
          <DetailItem title="Reward Pool">
            <RewardBadge
              payment={{ amount: fromTokenAmount(serviceRequest.configuration.pTokenQ, token?.decimals ?? 18), token }}
              reputation={{ amount: REPUTATION_REWARD_POOL.toLocaleString() }}
            />
          </DetailItem>
          <DetailItem title="Submissions">
            <Badge className="px-4 min-w-full">{serviceRequest.submissionCount}</Badge>
          </DetailItem>
          <DetailItem title="Reviews">
            <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
          </DetailItem>
          <DetailItem title="Participants">
            <Badge className="px-4 min-w-full">{numParticipants}</Badge>
          </DetailItem>
        </Detail>

        <ClientOnly>{() => <ParsedMarkdown text={DOMPurify.sanitize(description)} />}</ClientOnly>
      </section>

      <TabNav className="mb-10">
        <TabNavLink to="./#tabNav" end>
          Submissions <span className="text-gray-400">{serviceRequest.submissionCount}</span>
        </TabNavLink>
        <TabNavLink to="./prereqs#tabNav">Prerequisites</TabNavLink>
        <TabNavLink to="./rewards#tabNav">Rewards</TabNavLink>
        <TabNavLink to="./timeline#tabNav">Timeline &amp; Deadlines</TabNavLink>
        <TabNavLink to="./participants#tabNav">Participants</TabNavLink>
      </TabNav>

      <Outlet />
    </Container>
  );
}
