import { Avatar, Button, Text, Title } from "@mantine/core";
import * as Author from "~/components/Author";
import { Detail } from "~/components/Detail";
import { InfoCard } from "~/components/InfoCard";
import { ProjectBadge } from "~/components/ProjectBadge";

export default function Marketplace() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-16">
      <header className="flex justify-between">
        <Title size="h1">Marketplace Title</Title>
        <Button>Launch Challenge</Button>
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
      <Text size="sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
        pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit fermentum,
        consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus, ligula commodo aliquet
        velit massa. Lacinia lacus amet massa
      </Text>

      {/* Reward and requirment details */}
      <div className="grid grid-cols-2 gap-6">
        {/* Rewards */}
        <div>
          <header className="mb-4">
            <Title size="h4">Challenge Marketplace Reward Details</Title>
            <Text color="gray" size="sm">
              How rewards are distributed and how liquid the challange marketplace is
            </Text>
          </header>
          <div className="grid grid-cols-2 gap-5">
            <InfoCard>
              <InfoCard.Title>Challenge Pools Total</InfoCard.Title>
              <Detail>
                <Detail.Title>Sum of all active challenge markets</Detail.Title>
                <Text>10,000 USD</Text>
              </Detail>
            </InfoCard>
            <InfoCard>
              <InfoCard.Title>Reward Curve</InfoCard.Title>
              <Detail>
                <Detail.Title>Sets how rewards are distributed</Detail.Title>
                <Text>10,000 USD</Text>
              </Detail>
            </InfoCard>
            <InfoCard className="col-span-2">
              <InfoCard.Title>Challenge Pools Total</InfoCard.Title>
              <Detail>
                <Detail.Title>Tokens that are earned in this marketplace</Detail.Title>
                <Text>10,000 USD</Text>
              </Detail>
            </InfoCard>
          </div>
        </div>
        {/* end Rewards */}
        {/* Requirements */}
        <div>
          <header className="mb-4">
            <Title size="h4">Entry Requirements</Title>
            <Text color="gray" size="sm">
              What you need in your wallet in order to perform actions on challenges
            </Text>
          </header>
          <div className="grid grid-cols-2 gap-5">
            <InfoCard>
              <InfoCard.Title>xMETRIC Balanace</InfoCard.Title>
              <div className="flex space-x-6">
                <Detail>
                  <Detail.Title>Min balance</Detail.Title>
                  <Text>15 xMETRIC</Text>
                </Detail>
                <Detail>
                  <Detail.Title>Max balance</Detail.Title>
                  <Text>100 xMETRIC</Text>
                </Detail>
              </div>
            </InfoCard>
            <InfoCard>
              <InfoCard.Title>Badge Required to Review</InfoCard.Title>
              <Detail>
                <Detail.Title>MDAO s4 reviewer badge</Detail.Title>
                <div className="flex items-center space-x-2">
                  <Avatar size="sm" radius="xl" />
                  <Text>0x12345</Text>
                </div>
              </Detail>
            </InfoCard>
            <InfoCard>
              <InfoCard.Title>Badge Required to Create a Challenge</InfoCard.Title>
              <Detail>
                <Detail.Title>MDAO s4 contributor badge</Detail.Title>
                <div className="flex items-center space-x-2">
                  <Avatar size="sm" radius="xl" />
                  <Text>0x12345</Text>
                </div>
              </Detail>
            </InfoCard>
          </div>
        </div>
        {/* end Requirements */}
      </div>
    </div>
  );
}
