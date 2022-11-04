import { Avatar, Text } from "@mantine/core";
import { Link } from "@remix-run/react";

// Renders a wallet's avatar and address or ENS name along with a UserCard on hover.
export function Author() {
  return (
    <Link to="/u/id">
      <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
        <div className="flex rounded-full bg-[#F1F3F5] px-1">
          <Avatar size={24} radius="xl" />
          <Text size="sm">Joji.ETH</Text>
        </div>
        <Text size="xs" className="px-1">
          400 xMetric
        </Text>
      </div>
    </Link>
  );
}
