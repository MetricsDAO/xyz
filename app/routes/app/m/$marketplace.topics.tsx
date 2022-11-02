import { Button, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import * as Author from "~/components/Author";
import { Detail } from "~/components/Detail";
import { ProjectBadge } from "~/components/ProjectBadge";
import type { Topic } from "~/domain";

export default function MarketplaceTopics() {
  return (
    <div className="container mx-auto max-w-6xl space-y-10 py-16">
      <header className="flex justify-between">
        <Title size="h1">Marketplace Title</Title>
        {/* <Link to={`/app/m/[marketplaceId]/t/new`}> */}
        <Button>Launch Challenge</Button>
        {/* </Link> */}
      </header>

      {/* Sponsor and project details */}
      <div className="flex space-x-8">
        <Detail>
          <Detail.Title>Sponsor</Detail.Title>
          <Author.Author />
        </Detail>
        <Detail>
          <Detail.Title>Chain/Project</Detail.Title>
          <div className="flex space-x-2">
            <ProjectBadge slug="solana" />
            <ProjectBadge slug="solana" />
          </div>
        </Detail>
      </div>

      {/* Description */}
      <Text size="sm" className="md:w-2/3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
        pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit fermentum,
        consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus, ligula commodo aliquet
        velit massa. Lacinia lacus amet massa
      </Text>

      {/* Challenge details */}
      <TopicsTable topics={[]} />
    </div>
  );
}

function TopicsTable({ topics }: { topics: Topic[] }) {
  return (
    <div className="overflow-auto">
      <div className="min-w-[350px] w-full border-spacing-4 border-separate">
        <div className="flex items-center space-x-2 text-left px-4 text-[#666666]">
          <div className="w-2/6 font-normal overflow-hidden text-ellipsis">Brainstorm</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Chain/Project</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Potential Rewards</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Entry to Submit</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis"># Challenges</div>
        </div>
        <div className="space-y-4">
          {topics.map((m) => {
            return (
              <Link
                to="/app/m/[marketplaceId]"
                className="flex space-x-2 border-solid border-2 border-[#EDEDED] py-5 px-4 rounded-lg hover:border-black"
                key={m.id}
              >
                <div className="w-2/6">{m.title}</div>
                {/* <div className="w-1/6">{m.project}</div>
                <div className="w-1/6">{m.rewardPool} USD</div>
                <div className="w-1/6">{m.entryCost} xMetric</div>
                <div className="w-1/6">{m.topicCount}</div> */}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
