import type { Project } from "@prisma/client";
import { Link, Outlet, useParams } from "@remix-run/react";
import { $path } from "remix-routes";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import invariant from "tiny-invariant";
import { UserBadge } from "~/components";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { ProjectBadges } from "~/features/project-badges";
import { findLaborMarket } from "~/services/labor-market.server";
import { listProjects } from "~/services/projects.server";

export const loader = async (data: DataFunctionArgs) => {
  invariant(data.params.laborMarketAddress, "laborMarketAddress must be specified");
  const laborMarket = await findLaborMarket(data.params.laborMarketAddress);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }

  const allProjects = await listProjects();
  const laborMarketProjects = laborMarket.appData?.projectSlugs
    .map((slug) => {
      return allProjects.find((p) => p.slug === slug);
    })
    .filter((p): p is Project => !!p);

  return typedjson({ laborMarket, laborMarketProjects });
};

export default function Marketplace() {
  const { laborMarket, laborMarketProjects } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  return (
    <Container className="py-16 px-10">
      <section className="flex flex-wrap gap-5 justify-between pb-5">
        <h1 className="text-3xl font-semibold">{laborMarket?.appData?.title} </h1>
        <div className="flex flex-wrap gap-5">
          <ConnectWalletWrapper>
            <Button size="lg" asChild>
              <Link
                to={$path("/app/:mType/m/:laborMarketAddress/sr/new", {
                  mType: mType,
                  laborMarketAddress: laborMarket.address,
                })}
              >
                Launch Challenge
              </Link>
            </Button>
          </ConnectWalletWrapper>
        </div>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        <div className="flex flex-wrap gap-x-8">
          <Detail>
            {laborMarket?.configuration.owner ? (
              <DetailItem title="Sponser">
                <UserBadge url="u/id" address={laborMarket?.configuration.owner as `0x${string}`} balance={200} />
              </DetailItem>
            ) : (
              <></>
            )}
            {laborMarketProjects && (
              <DetailItem title="Chain/Project">{<ProjectBadges projects={laborMarketProjects} />}</DetailItem>
            )}
          </Detail>
        </div>
        <p className="max-w-2xl text-gray-500 text-sm">{laborMarket?.appData?.description}</p>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <TabNav className="mb-10">
            <TabNavLink to="" end>
              {`Challenges (${laborMarket?.serviceRequestCount} )`}
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
