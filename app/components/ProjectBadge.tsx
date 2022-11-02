import { Avatar, Badge, Text } from "@mantine/core";
import type { ProjectSlug } from "~/domain";
import { Projects } from "~/domain";

type Props = {
  // Slug for the project.
  slug: ProjectSlug;
};

export function ProjectBadge({ slug }: Props) {
  const project = Projects.find((project) => project.slug === slug);
  if (!project) {
    throw new Error(`Project with slug ${slug} not found.`);
  }
  return (
    <Badge color="gray" leftSection={<Avatar size={24} radius="xl" />} size="lg">
      <Text size="sm" className="normal-case font-normal">
        {project.name}
      </Text>
    </Badge>
  );
}
