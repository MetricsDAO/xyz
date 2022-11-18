import type { Project } from "@prisma/client";
import { Badge } from "./Badge";

export function ProjectBadge({ project }: { project: Project }) {
  return (
    <Badge className="pl-2">
      <img src={`/logos/${project.slug}.svg`} alt={`${project.name} logo`} className="h-4 w-4" />
      <span className="mx-1">{project.name}</span>
    </Badge>
  );
}
