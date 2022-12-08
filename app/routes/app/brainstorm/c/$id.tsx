import { Link, Outlet } from "@remix-run/react";
import { Detail, DetailItem } from "~/components/detail";
import { UserBadge } from "~/components/UserBadge";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { Container } from "~/components/Container";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { ProjectAvatar } from "~/components/avatar";
import { countReviews } from "~/services/review-service.server";

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const challenge = await findChallenge(id);
  if (!challenge) {
    throw notFound({ id });
  }

  const submissionIds = challenge.submissions.map((s) => s.id);
  const numOfReviews = await countReviews(submissionIds);
  return typedjson({ challenge, numOfReviews }, { status: 200 });
};

export default function Challenge() {
  const { challenge, numOfReviews } = useTypedLoaderData<typeof loader>();
  return (
    <Container className="py-16">
      <header className="flex space-x-4 mb-16">
        <h1 className="text-3xl font-semibold w-full">{challenge.title}</h1>
        <Button variant="cancel" size="lg" asChild>
          <Link to={`/app/brainstorm/c/${challenge.id}/review`}>Claim to Review</Link>
        </Button>
        <Button variant="primary" size="lg" asChild>
          <Link to={`/app/brainstorm/c/${challenge.id}/claim`}>Claim to Submit</Link>
        </Button>
      </header>
      <Detail className="mb-6">
        <DetailItem title="Sponsor">
          <UserBadge url="u/id" name="jo.Eth" balance={200} />
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
          <Badge className="bg-gray-200">
            <Badge className="bg-gray-100">100 SOL</Badge> 500 rMETRIC
          </Badge>
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
