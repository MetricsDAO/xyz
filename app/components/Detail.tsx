import { Link } from "@remix-run/react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { PROJECT_ICONS, TOKEN_ICONS } from "~/utils/helpers";
import { UserAvatarFilledAlt32 } from "@carbon/icons-react";
import clsx from "clsx";

export function Detail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

Detail.Title = function DetailTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs text-neutral-700 uppercase">{children}</p>;
};

Detail.User = function DetailUser({ url, name, balance }: { url: string; name: string; balance: number }) {
  return (
    <Link to={url}>
      <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
        <div className="flex rounded-full bg-[#F1F3F5] px-1 gap-x-1 items-center py-1">
          <UserAvatarFilledAlt32 height={16} width={16} />
          <p className="text-sm">{name}</p>
        </div>
        <p className="text-xs px-1">{balance} rMETRIC</p>
      </div>
    </Link>
  );
};

Detail.Project = function DetailProject({ slug }: { slug: string }) {
  const iconUrl = PROJECT_ICONS[slug];
  return (
    <div className="flex rounded-full bg-[#F6F6F6] items-center gap-x-1 pl-1 pr-2 py-1">
      {iconUrl && (
        <RadixAvatar.Root>
          <RadixAvatar.Image className="w-5 h-5 rounded-full" src={iconUrl} alt="" />
          <RadixAvatar.Fallback delayMs={500}>
            <UserAvatarFilledAlt32 height={16} width={16} />
          </RadixAvatar.Fallback>
        </RadixAvatar.Root>
      )}
      <p className="text-black font-normal">{slug}</p>
    </div>
  );
};

Detail.Token = function DetailToken({ name, symbol }: { name: string; symbol: String }) {
  const iconUrl = TOKEN_ICONS[name];
  return (
    <div className="flex rounded-full bg-[#F6F6F6] items-center gap-x-1 pl-1 pr-2 py-1">
      {iconUrl && (
        <RadixAvatar.Root>
          <RadixAvatar.Image className="w-5 h-5 rounded-full" src={iconUrl} alt="" />
          <RadixAvatar.Fallback delayMs={500}>
            <UserAvatarFilledAlt32 height={16} width={16} />
          </RadixAvatar.Fallback>
        </RadixAvatar.Root>
      )}
      <p className="text-black font-normal uppercase">{symbol}</p>
    </div>
  );
};

Detail.Score = function DetailScore({ score }: { score: number }) {
  let result = "Spam";
  if (score === 100) {
    result = "Great";
  } else if (score > 75) {
    result = "Good";
  } else if (score > 50) {
    result = "Average";
  } else if (score > 25) {
    result = "Bad";
  }

  return (
    <div
      className={clsx(
        { "bg-[#85BD63]": result === "Great" },
        { "bg-[#6993FF]": result === "Good" },
        { "bg-[#808080]": result === "Average" },
        { "bg-[#EFA453]": result === "Bad" },
        { "bg-[#F57F86]": result === "Spam" },
        "flex rounded-full items-center w-28"
      )}
    >
      <div
        className={clsx(
          { "bg-[#D9F0CA]": result === "Great" },
          { "bg-[#D1DEFF]": result === "Good" },
          { "bg-[#DEDEDE]": result === "Average" },
          { "bg-[#FFE2C2]": result === "Bad" },
          { "bg-[#F8D4D7]": result === "Spam" },
          "rounded-full bg-[#D1DEFF] w-3/4 py-1"
        )}
      >
        <p className="normal-case font-normal text-center text-sm">{result}</p>
      </div>
      <p className="mx-auto pl-1 pr-2 text-white text-sm">{score}</p>
    </div>
  );
};

Detail.Reward = function DetailReward({
  tokenAmount,
  token,
  rMetric,
}: {
  tokenAmount: number;
  token: string;
  rMetric: number;
}) {
  return (
    <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
      <div className="flex rounded-full bg-[#F1F3F5] px-2 items-center uppercase py-1">
        <p className="text-sm">
          {tokenAmount} {token}
        </p>
      </div>
      <p className="text-xs px-1">{rMetric} rMETRIC</p>
    </div>
  );
};

Detail.Badge = function DetailBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full bg-[#F6F6F6] w-min-15 px-3 py-1">
      <p className="text-black text-sm text-center">{children}</p>
    </div>
  );
};
