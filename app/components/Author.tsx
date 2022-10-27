import { Avatar, Badge, Group, Text } from "@mantine/core";
import { Link } from "@remix-run/react";

// Renders a wallet's avatar and address or ENS name along with a UserCard on hover.
export function Author() {
  return (
    <Link to="/u/id">
      <Group spacing="xs">
        <Avatar size={24} radius="xl" />
        <Text>joji.eth</Text>
        <Badge>400 xMETRIC</Badge>
      </Group>
    </Link>
  );
}
