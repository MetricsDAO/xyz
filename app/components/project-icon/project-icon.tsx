import type { Project } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";

type ProjectIconProps = {
  project: Pick<Project, "name" | "slug">;
};

export function ProjectIcon({ project }: ProjectIconProps) {
  return (
    <Avatar.Root className="h-6 w-6 items-center justify-center rounded-full">
      <Avatar.Image
        src={`/img/icons/project-icons/${project.slug}.svg`}
        alt={`${project.name} logo`}
        className="object-contain"
      />
      <Avatar.Fallback className="h-6 w-6 flex items-center justify-center text-xs text-gray-100 bg-gray-400 rounded-full">
        {project.slug.at(0)?.toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
