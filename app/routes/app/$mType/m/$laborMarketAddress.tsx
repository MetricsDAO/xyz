import { Link, Outlet, useParams } from "@remix-run/react";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { Badge, ProjectAvatar, UserBadge } from "~/components";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Detail, DetailItem } from "~/components/detail";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { findLaborMarket } from "~/services/labor-market.server";
import { $path } from "remix-routes";
import invariant from "tiny-invariant";

export const loader = async (data: DataFunctionArgs) => {
  // TODO: Refactor
  // const url = new URL(data.request.url);
  // const params = getParamsOrFail(url.searchParams, LaborMarketSearchSchema);

  // if (params.laborMarket == undefined) {
  //   params.laborMarket = data.params.laborMarketAddress;
  // }

  let laborMarket = undefined;

  if (data.params.laborMarketAddress != undefined) {
    laborMarket = await findLaborMarket(data.params.laborMarketAddress);
  }

  return typedjson({ laborMarket });
};

export default function Marketplace() {
  const { laborMarket } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();
  invariant(mType, "marketplace type must be specified");

  return (
    <Container className="py-16">
      <div className="mx-auto container mb-12 px-10">
        <section className="flex flex-wrap gap-5 justify-between pb-5">
          <h1 className="text-3xl font-semibold">{laborMarket?.title} </h1>
          <div className="flex flex-wrap gap-5">
            <Button asChild size="lg">
              <Link
                to={$path("/app/:mType/m/:laborMarketaddress/sr/new", {
                  mType: mType,
                  laborMarketAddress: laborMarket?.address,
                })}
              >
                Launch Challenge
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex flex-col space-y-7 pb-12">
          <div className="flex flex-wrap gap-x-8">
            <Detail>
              {laborMarket?.sponsorAddress ? (
                <DetailItem title="Sponser">
                  <UserBadge url="u/id" address={laborMarket?.sponsorAddress as `0x${string}`} balance={200} />
                </DetailItem>
              ) : (
                <></>
              )}
              <DetailItem title="Chain/Project">
                {/*{laborMarket?.projects?.map((p) => (
                  <Badge key={p.slug} className="pl-2">
                    <ProjectAvatar project={p} />
                    <span className="mx-1">{p.name}</span>
                  </Badge>
                ))}*/}
              </DetailItem>
            </Detail>
          </div>
          <p className="max-w-2xl text-gray-500 text-sm">{laborMarket?.description}</p>
        </section>

        <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
          <main className="flex-1">
            <TabNav className="mb-10">
              <TabNavLink to="" end>
                {`Challenges (${laborMarket?._count.serviceRequests})`}
              </TabNavLink>
              <TabNavLink to="./prereqs">Prerequisites</TabNavLink>
              <TabNavLink to="./rewards">Rewards</TabNavLink>
            </TabNav>
            <Outlet />
          </main>
        </section>
      </div>
    </Container>
  );
}
