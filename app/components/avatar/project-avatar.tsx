import type { Project } from "@prisma/client";
import { Avatar } from "./avatar";

type Props = {
  project: Pick<Project, "name" | "slug">;
};

// existing icon files. Avoid 404s.
const ICONS = ["avalanche", "axelar", "ethereum", "flow", "matic", "near", "polygon", "solana"];

export function ProjectAvatar({ project }: Props) {
  let src;
  if (ICONS.includes(project.slug)) {
    src = `/img/icons/project-icons/${project.slug}.svg`;
  }

  return <Avatar src={src} alt={`${project.name} logo`} fallback={project.slug.at(0)?.toUpperCase()} />;
}
