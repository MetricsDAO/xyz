import { Avatar } from "./avatar";
import { ProjectAvatar } from "./project-avatar";
import { TokenAvatar } from "./token-avatar";

export const Fallback = () => {
  return (
    <div className="flex flex-col gap-5">
      <Avatar size="sm" />
      <Avatar size="md" fallback={"f"} />
      <Avatar size="lg" fallback={"F"} />
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-5">
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" size="sm" />
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" size="md" />
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" size="lg" />
    </div>
  );
};

export const Project = () => {
  return <ProjectAvatar project={{ name: "Bitcoin", slug: "bitcoin" }} />;
};

export const Token = () => {
  return <TokenAvatar token={{ name: "Bitcoin", symbol: "BTC" }} />;
};

export const Group = () => {
  return (
    <Avatar.Group>
      <Avatar src="https://dev.metricsdao.xyz/img/icons/project-icons/polygon.svg" size="lg" />
      <Avatar src="https://dev.metricsdao.xyz/img/icons/project-icons/ethereum.svg" size="lg" />
      <Avatar src="https://dev.metricsdao.xyz/img/icons/project-icons/avalanche.svg" size="lg" />
    </Avatar.Group>
  );
};
