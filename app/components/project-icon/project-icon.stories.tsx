import { ProjectIcon } from "./project-icon";

// URL will fail since src url won't resolve
export const Fallback = () => {
  return <ProjectIcon project={{ name: "Bitcoin", slug: "bitcoin" }} />;
};
