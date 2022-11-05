import { Avatar, Badge, Text } from "@mantine/core";
import type { Project } from "@prisma/client";
// import type { Project } from "~/mdao";

type Props = {
  // Slug for the project.
  project: Project;
};

export function ProjectBadge({ project }: Props) {
  return (
    <Badge color="gray" leftSection={<Avatar size={24} radius="xl" />} size="lg">
      <Text size="sm" className="normal-case font-normal">
        {project.name}
      </Text>
    </Badge>
  );
}
