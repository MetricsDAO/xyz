import type { Project } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";

type ProjectIconProps = {
  project: Project;
};

export function ProjectIcon({ project }: ProjectIconProps) {
  return (
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
  );
}
