import type { Project } from "@prisma/client";
import { useState } from "react";
import { Badge, ProjectAvatar } from "~/components";

export function ProjectBadges({ projects }: { projects: Project[] }) {
  const [allIcons, setAllIcons] = useState<boolean>(false);
  const max = 3;
  const surplus = projects.length - max;
  return (
    <div className="flex flex-wrap gap-2">
      {projects.slice(0, max).map((p) => {
        return (
          <Badge key={p.id} className="pl-2">
            <ProjectAvatar project={p} />
            <span className="mx-1">{p.name}</span>
          </Badge>
        );
      })}
      {surplus > 0 && (
        <div onClick={() => setAllIcons(!allIcons)} className="flex flex-wrap gap-2 cursor-pointer">
          {allIcons ? (
            <>
              {projects.slice(max).map((p) => {
                return (
                  <Badge key={p.id} className="pl-2">
                    <ProjectAvatar project={p} />
                    <span className="mx-1">{p.name}</span>
                  </Badge>
                );
              })}
            </>
          ) : (
            <Badge>{`${surplus}+`}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
