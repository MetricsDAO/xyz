import { useQuery } from "@tanstack/react-query";
import { useOptionalUser } from "~/hooks/use-user";

export function RewardsBadge() {
  const user = useOptionalUser();
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["rewardBadge", user?.id],
    queryFn: () => fetch("/api/rewards").then((res) => res.json()),
  });

  return (
    <span>
      Rewards{" "}
      {data && data?.length > 0 && <span className="bg-gray-400 rounded-md py-1 px-2 text-white">{data?.length}</span>}
    </span>
  );
}
