import { Outlet } from "@remix-run/react";
import DOMPurify from "dompurify";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ClientOnly, notFound, serverError } from "remix-utils";
import { z } from "zod";
import { UserBadge } from "~/components";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { ParsedMarkdown } from "~/components/markdown-editor/markdown.client";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { EvmAddressSchema } from "~/domain/address";
import { getLaborMarket } from "~/domain/labor-market/functions.server";
import { ProjectBadges } from "~/features/project-badges";
import { WalletGuardedButtonLink } from "~/features/wallet-guarded-button-link";
import { usePrereqs } from "~/hooks/use-prereqs";
import { useOptionalUser } from "~/hooks/use-user";
import { findProjectsBySlug } from "~/services/projects.server";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async (data: DataFunctionArgs) => {
  const parsed = paramsSchema.safeParse(data.params);
  if (!parsed.success) throw serverError("Error parsing params");
  const laborMarket = await getLaborMarket(parsed.data.address);
  if (!laborMarket) throw notFound("Labor market not found");

  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ laborMarket, laborMarketProjects });
};

export default function Marketplace() {
  const { laborMarket, laborMarketProjects } = useTypedLoaderData<typeof loader>();

  const user = useOptionalUser();
  const userSignedIn = !!user;
  const { canLaunchChallenges } = usePrereqs({ laborMarket });

  return (
    <Container className="pb-16 pt-7 px-10">
      <section className="flex flex-col md:flex-row gap-5 justify-between pb-5">
        <h1 className="text-3xl font-semibold md:basis-3/4">{laborMarket?.appData?.title}</h1>
        <div className="flex flex-wrap gap-5 md:basis-1/4 md:justify-end">
          <WalletGuardedButtonLink
            buttonText="Launch Challenge"
            link={`/app/market/${laborMarket.address}/request/new`}
            disabled={userSignedIn && !canLaunchChallenges}
            disabledTooltip="Check for Prerequisites"
            size="lg"
          />
        </div>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        <div className="flex flex-wrap gap-x-8">
          <Detail>
            <DetailItem title="Sponsor">
              <UserBadge address={laborMarket.configuration.deployer} />
            </DetailItem>
            <DetailItem title="Chain/Project">{<ProjectBadges projects={laborMarketProjects} />}</DetailItem>
          </Detail>
        </div>
        <ClientOnly>{() => <ParsedMarkdown text={DOMPurify.sanitize(laborMarket.appData.description)} />}</ClientOnly>
      </section>

      <section className="flex flex-1 flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <TabNav className="mb-10">
            <TabNavLink to="./#tabNav" end>
              {/* Challenges ({laborMarket.indexData.serviceRequestCount}) */}
              Challenges (number will go here )
            </TabNavLink>
            <TabNavLink to="./prereqs#tabNav">Prerequisites</TabNavLink>
            <TabNavLink to="./rewards#tabNav">Rewards</TabNavLink>
          </TabNav>
          <Outlet />
        </main>
      </section>
    </Container>
  );
}
