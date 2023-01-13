import { Link, Outlet } from "@remix-run/react";
import { Detail, DetailItem } from "~/components/detail";
import { UserBadge } from "~/components/user-badge";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
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

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { laborMarketAddress, serviceRequestId } = paramsSchema.parse(params);
  const challenge = await findChallenge(serviceRequestId, laborMarketAddress);
  if (!challenge) {
    throw notFound({ serviceRequestId });
  }

  const submissionIds = challenge.submissions.map((s) => s.contractId);
  const numOfReviews = await countReviews(submissionIds);
  return typedjson({ challenge, numOfReviews }, { status: 200 });
};

export default function Challenge() {
  const { challenge, numOfReviews } = useTypedLoaderData<typeof loader>();
  return (
    <Container className="py-16">
      <header className="flex flex-wrap gap-5 justify-between pb-16">
        <h1 className="text-3xl font-semibold">{challenge.title}</h1>
        <div className="flex flex-wrap gap-5">
          <Button variant="cancel" size="lg" asChild>
            <Link to={`/app/brainstorm/m/${challenge.laborMarketAddress}/sr/${challenge.contractId}/review`}>
              Claim to Review
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link to={`/app/brainstorm/m/${challenge.laborMarketAddress}/sr/${challenge.contractId}/claim`}>
              Claim to Submit
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link to={`/app/brainstorm/m/${challenge.laborMarketAddress}/sr/${challenge.contractId}/submit`}>
              Submit
            </Link>
          </Button>
        </div>
      </header>
      <Detail className="mb-6 flex flex-wrap gap-y-2">
        <DetailItem title="Sponsor">
          <UserBadge url="u/id" address="0x983110309620D911731Ac0932219af06091b6744" balance={200} />
        </DetailItem>
        <DetailItem title="Chain/Project">
          <div className="flex space-x-4">
            {challenge.laborMarket.projects.map((p) => (
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
          <Badge className="px-4 min-w-full">{challenge._count.submissions}</Badge>
        </DetailItem>
        <DetailItem title="Reviews">
          <Badge className="px-4 min-w-full">{numOfReviews}</Badge>
        </DetailItem>
        <DetailItem title="Winner">
          <Badge>Pending</Badge>
        </DetailItem>
      </Detail>

      <article className="text-zinc-500 text-sm space-y-4 mb-20 w-full md:w-2/3">
        <p>
          What's the challenge What web3 topic do you want to crowdsource potential analytics questions for? Why? What's
          the challenge What web3 topic do you want to crowdsource potential analytics questions
        </p>
      </article>

      <TabNav className="mb-8">
        <TabNavLink to="" end>
          Submissions <span className="text-gray-400">({challenge._count.submissions})</span>
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
