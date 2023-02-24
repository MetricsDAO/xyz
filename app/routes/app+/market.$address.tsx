import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Link, Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { badRequest, notFound } from "remix-utils";
import { z } from "zod";
import { UserBadge } from "~/components";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ProjectBadges } from "~/features/project-badges";
import { findLaborMarket } from "~/services/labor-market.server";
import { findProjectsBySlug } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";

const paramsSchema = z.object({ address: z.string() });
export const loader = async (data: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(data.params);
  const laborMarket = await findLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }

  if (!laborMarket.appData) {
    throw badRequest("Labor market app data is missing");
  }

  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  const tokens = await listTokens();
  return typedjson({ laborMarket, laborMarketProjects, tokens });
};

export default function Marketplace() {
  const { laborMarket, laborMarketProjects } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="pb-16 pt-9 px-10">
      <div className="flex gap-3.5 text-stone-500 pb-12 items-center">
        <ChevronLeftIcon className="h-4 w-4" />
        <Link className="text-sm" to={`/app/${laborMarket.appData?.type}`}>
          Marketplaces
        </Link>
      </div>
      <section className="flex flex-wrap gap-5 justify-between pb-5">
        <h1 className="text-3xl font-semibold">{laborMarket?.appData?.title} </h1>
        <div className="flex flex-wrap gap-5">
          <ConnectWalletWrapper>
            <Button size="lg" asChild>
              <Link to={`/app/market/${laborMarket.address}/request/new`}>Launch Challenge</Link>
            </Button>
          </ConnectWalletWrapper>
        </div>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        <div className="flex flex-wrap gap-x-8">
          <Detail>
            {laborMarket?.configuration.owner ? (
              <DetailItem title="Sponsor">
                <UserBadge address={laborMarket?.configuration.owner as `0x${string}`} />
              </DetailItem>
            ) : (
              <></>
            )}
            <DetailItem title="Chain/Project">{<ProjectBadges projects={laborMarketProjects} />}</DetailItem>
          </Detail>
        </div>
        <p className="max-w-2xl text-gray-500 text-sm">{laborMarket?.appData?.description}</p>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <TabNav className="mb-10">
            <TabNavLink to="" end>
              {`Challenges (${laborMarket?.serviceRequestCount})`}
            </TabNavLink>
            <TabNavLink to="./prereqs">Prerequisites</TabNavLink>
            <TabNavLink to="./rewards">Rewards</TabNavLink>
          </TabNav>
          <Outlet />
        </main>
      </section>
    </Container>
  );
}
