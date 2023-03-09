import type { Project } from "@prisma/client";
import { Badge, ProjectAvatar } from "~/components";

const MAX = 3;

export function ProjectBadges({ projects }: { projects: Project[] }) {
  const surplus = projects.length - MAX;
  return (
    <div className="flex flex-wrap gap-2">
      {projects.slice(0, MAX).map((p) => {
        return (
          <Badge key={p.id} className="pl-2">
            <ProjectAvatar project={p} />
            <span className="mx-1">{p.name}</span>
          </Badge>
        );
      })}
      {surplus > 0 && (
        <div className="flex flex-wrap gap-2 group">
          <div className="hidden group-hover:flex flex-wrap gap-2">
            {projects.slice(MAX).map((p) => {
              return (
                <Badge key={p.id} className="pl-2">
                  <ProjectAvatar project={p} />
                  <span className="mx-1">{p.name}</span>
                </Badge>
              );
            })}
          </div>
          <Badge className="block group-hover:hidden">{`${surplus}+`}</Badge>
        </div>
      )}
    </div>
  );
}
