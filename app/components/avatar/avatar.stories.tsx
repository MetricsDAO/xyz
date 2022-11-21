import { Avatar } from "./avatar";

export const Fallback = () => {
  return (
    <div className="flex flex-col gap-5">
      <Avatar />
      <Avatar />
      <Avatar />
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
