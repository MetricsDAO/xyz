import type { Project } from "@prisma/client";
import type { BadgeProps } from "./Badge";
import { Badge } from "./Badge";
import * as Avatar from "@radix-ui/react-avatar";

type ProjectBadgeProps = {
  project: Project;
  variant?: BadgeProps["variant"];
};

export function ProjectBadge({ project, variant }: ProjectBadgeProps) {
  return (
    <Badge className="pl-2" variant={variant}>
      <Avatar.Root className="h-5 w-5 items-center justify-center rounded-full">
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
