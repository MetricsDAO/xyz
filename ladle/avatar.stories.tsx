import Avatar from "~/components/Avatar";

export const Fallback = () => {
  return (
    <div className="flex flex-col gap-5">
      <Avatar src="badlink" alt="github example ld" delay={0} size="lg" />
      <Avatar src="badlink" alt="github example md" delay={0} size="md" />
      <Avatar src="badlink" alt="github example sm" delay={0} size="sm" />
    </div>
  );
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-5">
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" alt="github example lg" size="lg" />
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" alt="github example md" size="md" />
      <Avatar src="https://avatars.githubusercontent.com/u/11708259?v=4" alt="github example sm" size="sm" />
    </div>
  );
};
