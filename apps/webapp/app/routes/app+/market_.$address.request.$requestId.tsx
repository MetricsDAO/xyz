import type { Token } from "@prisma/client";
import { Link, Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import * as DOMPurify from "dompurify";
import { BigNumber } from "ethers";
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
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { EvmAddressSchema } from "~/domain/address";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { countReviews } from "~/domain/review/functions.server";
import { getServiceRequest } from "~/domain/service-request/functions.server";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import DeleteServiceRequestModal from "~/features/delete-service-request";
import { ProjectBadges } from "~/features/project-badges";
import { WalletGuardedButtonLink } from "~/features/wallet-guarded-button-link";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useTokens } from "~/hooks/use-root-data";
import { useServiceRequestPerformance } from "~/hooks/use-service-request-performance";
import { useOptionalUser } from "~/hooks/use-user";
import { findProjectsBySlug } from "~/services/projects.server";
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

  return typedjson({ serviceRequest, numOfReviews, laborMarket, serviceRequestProjects }, { status: 200 });
};

export default function ServiceRequest() {
  const { serviceRequest, numOfReviews, serviceRequestProjects, laborMarket } = useTypedLoaderData<typeof loader>();

  const user = useOptionalUser();
  const userSignedIn = !!user;
  const tokens = useTokens();

  const claimDeadlinePassed = dateHasPassed(serviceRequest.configuration.signalExp);
  const claimToReviewDeadlinePassed = dateHasPassed(claimToReviewDeadline(serviceRequest));

  const providerToken = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenProvider);
  const reviewerToken = tokens.find((t) => t.contractAddress === serviceRequest.configuration.pTokenReviewer);

  const performance = useServiceRequestPerformance({
    laborMarketAddress: serviceRequest.laborMarketAddress,
    serviceRequestId: serviceRequest.id,
  });
  const claimedReviews = serviceRequest.indexData.claimsToReview.reduce((sum, claim) => sum + claim.signalAmount, 0);
  const claimedSubmissions = serviceRequest.indexData.claimsToSubmit.length;

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
    <Container className={`h-full pt-7 pb-16`}>
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
        <Detail className="flex flex-wrap gap-y-2">
          <DetailItem title="Sponsor">
            <UserBadge address={laborMarket.configuration.deployer} />
          </DetailItem>
          <div className="flex space-x-4">
            {serviceRequestProjects && (
              <DetailItem title="Chain/Project">{<ProjectBadges projects={serviceRequestProjects} />}</DetailItem>
            )}
          </div>
        </Detail>
        <Detail className="mb-6 flex flex-wrap gap-y-2">
          <DetailItem title="Analyst Pool">
            <RewardClaimBadge
              payment={{
                amount: fromTokenAmount(
                  serviceRequest.configuration.pTokenProviderTotal,
                  providerToken?.decimals ?? 18
                ),
                token: providerToken,
              }}
              text={`${fromTokenAmount(
                BigNumber.from(serviceRequest.configuration.pTokenProviderTotal)
                  .div(serviceRequest.configuration.providerLimit)
                  .toString(),
                providerToken?.decimals ?? 18
              )} per analyst`}
            />
          </DetailItem>
          <DetailItem title="Claims">
            <Badge className="px-4 min-w-full">
              {claimedSubmissions} / {serviceRequest.configuration.providerLimit}
            </Badge>
          </DetailItem>
          <DetailItem title="Submits">
            <Badge className="px-4 min-w-full">{serviceRequest.indexData.submissionCount}</Badge>
          </DetailItem>
          <div className="w-1 h-16 bg-gray-300 rounded-full mx-2" />
          <DetailItem title="Review Pool">
            <RewardClaimBadge
              payment={{
                amount: fromTokenAmount(
                  serviceRequest.configuration.pTokenReviewerTotal,
                  reviewerToken?.decimals ?? 18
                ),
                token: reviewerToken,
              }}
              text={`${fromTokenAmount(
                BigNumber.from(serviceRequest.configuration.pTokenReviewerTotal)
                  .div(serviceRequest.configuration.reviewerLimit)
                  .toString(),
                reviewerToken?.decimals ?? 18
              )} per review`}
            />
          </DetailItem>
          <DetailItem title="Claims">
            <Badge className="px-4 min-w-full">
              {claimedReviews} / {serviceRequest.configuration.reviewerLimit}
            </Badge>
          </DetailItem>
          <DetailItem title="Reviews">
            <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
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
      <Outlet />
    </Container>
  );
}

type BadgeProps = {
  payment: {
    amount: string;
    token?: Token;
  };
  text: string;
};

function RewardClaimBadge({ payment, text }: BadgeProps) {
  return (
    <div className="flex rounded-full items-center h-8 w-fit bg-gray-200">
      <div className="flex rounded-full px-2 gap-x-1 items-center py-1 h-8 bg-gray-100">
        <p className="text-sm text-black">
          <span className="inline-flex items-center justify-center h-8 whitespace-nowrap">
            <span className="mx-1">
              {payment.amount} {payment.token?.symbol ?? ""}
            </span>
          </span>
        </p>
      </div>
      <p className="text-sm pl-1 pr-2 text-neutral-500">{text}</p>
    </div>
  );
}
