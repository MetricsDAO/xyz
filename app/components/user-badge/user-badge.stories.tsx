import { UserBadge } from "./user-badge";

export const Index = () => {
  return (
    <div className="flex flex-col gap-5">
      <UserBadge url="u/uid" name="jo.eth" balance={200} />
      <UserBadge url="u/uid" name="ope.gotcha" balance={6000} />
    </div>
  );
};
