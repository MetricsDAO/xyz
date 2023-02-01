import type { Project } from "@prisma/client";
import { Badge, ProjectAvatar } from "~/components";

export function ProjectBadges({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {projects.map((p) => {
        return (
          <Badge key={p.id} className="pl-2">
            <ProjectAvatar project={p} />
            <span className="mx-1">{p.name}</span>
          </Badge>
        );
      })}
    </div>
  );
}
