import { Link, useParams } from "@remix-run/react";
import { $path } from "remix-routes";
import invariant from "tiny-invariant";
import { TokenAvatar } from "~/components/avatar";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Header, Row, Table } from "~/components/table";
import type { MarketplaceTableProps } from "~/routes/app/$mType";
import { findProjectsBySlug } from "~/utils/helpers";
import { ProjectBadges } from "./project-badges";

export function MarketplacesListView(props: MarketplaceTableProps) {
  if (props.marketplaces.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <MarketplacesTable {...props} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <MarketplacesCard {...props} />
      </div>
    </>
  );
}

function MarketplacesTable({ marketplaces, projects }: MarketplaceTableProps) {
  const { mType } = useParams();

  return (
    <Table>
      <Header columns={6} className="text-xs text-gray-500 font-medium mb-2">
        <Header.Column span={2}>{mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplace</Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Challenge Pool Totals</Header.Column>
        <Header.Column>Avg. Challenge Pool</Header.Column>
        <Header.Column>Active Challenges</Header.Column>
      </Header>
      {marketplaces.map((m) => {
        invariant(m.appData, "appdata must be valid");
        return (
          <Row asChild columns={6} key={m.address}>
            <Link
              to={$path("/app/:mType/m/:laborMarketAddress", { mType: m.appData.type, laborMarketAddress: m.address })}
              className="text-sm font-medium"
            >
              <Row.Column span={2}>{m.appData.title}</Row.Column>
              <Row.Column>
                <ProjectBadges projects={findProjectsBySlug(projects, m.appData.projectSlugs)} />
              </Row.Column>

              <Row.Column>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>
              </Row.Column>

              <Row.Column>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>
              </Row.Column>

              <Row.Column>{m.serviceRequestCount.toLocaleString()}</Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function MarketplacesCard({ marketplaces, projects }: MarketplaceTableProps) {
  const { mType } = useParams();

  return (
    <div>
      <div className="space-y-4">
        {marketplaces.map((m) => {
          invariant(m.appData, "marketplace type must be specified");
          return (
            <Card asChild key={m.address}>
              <Link
                to={`/app/${m.appData.type}/m/${m.address}`}
                className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
              >
                <div>{mType === "brainstorm" ? "Brainstorm" : "Analytics"} Marketplace</div>
                <div className="text-sm font-medium">{m.appData.title}</div>

                <div>Chain/Project</div>
                <div className="flex flex-wrap gap-2">
                  <ProjectBadges projects={findProjectsBySlug(projects, m.appData.projectSlugs)} />
                </div>

                <div>Challenge Pool Totals</div>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div>Avg. Challenge Pool</div>
                <Badge>
                  <TokenAvatar token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div>Active Challenges</div>
                <div>{m.serviceRequestCount.toLocaleString()}</div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
