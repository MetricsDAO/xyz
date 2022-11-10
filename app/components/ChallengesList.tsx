import { Link } from "@remix-run/react";
import type { ChallengeWithMarketplace } from "~/domain";
import { Badge } from "./Badge";

export function ChallengeList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col space-y-6">{children}</div>;
}

ChallengeList.Item = function ChallengeListItem({ challenge }: { challenge: ChallengeWithMarketplace }) {
  return (
    <div className="text-gray-500 flex justify-between">
      <div>
        <Link to="/" className="text-lg text-neutral-600">
          {challenge.title}
        </Link>
        <p className="text-sm">
          Sponsored by
          <Badge asChild>
            <Link to="/">{challenge.sponsor}</Link>
          </Badge>
        </p>
      </div>
      <div className="flex space-x-6 items-center">
        <p>Deadline in 3 hrs</p>
        <p>Reward 23 sol</p>
      </div>
    </div>
  );
};
