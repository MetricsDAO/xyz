import type { Project } from "@prisma/client";
import { Badge } from "./Badge";
import * as Avatar from "@radix-ui/react-avatar";

export function ProjectBadge({ project }: { project: Project }) {
  return (
    <Badge className="pl-2">
      <Avatar.Root className="h-5 w-5 items-center justify-center rounded-full bg-gray-200">
        <Avatar.Image
          src={`/img/icons/project-icons/${project.slug}.svg`}
          alt={`${project.name} logo`}
          className="object-contain"
        />
        <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs text-gray-100 bg-gray-400 rounded-full">
          {project.slug.at(0)?.toUpperCase()}
        </Avatar.Fallback>
      </Avatar.Root>
      {/* <img src={`/logos/${project.slug}.svg`} alt={`${project.name} logo`} className="h-4 w-4" /> */}
      <span className="mx-1">{project.name}</span>
    </Badge>
  );
}
