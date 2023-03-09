import type { Project } from "@prisma/client";
import { Avatar } from "./avatar";

type Props = {
  project: Pick<Project, "name" | "slug">;
};

export function ProjectAvatar({ project }: Props) {
  return (
    <Avatar
      src={`/img/icons/project-icons/${project.slug}.svg`}
      alt={`${project.name} logo`}
      fallback={project.slug.at(0)?.toUpperCase()}
    />
  );
}
