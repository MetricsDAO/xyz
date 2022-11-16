import { PROJECT_ICONS, TOKEN_ICONS } from "~/utils/helpers";
import Avatar from "./Avatar";

export function ProjectBadge({ slug }: { slug: string }) {
  const iconUrl = PROJECT_ICONS[slug];

  return <TextWithIcon text={slug} iconUrl={iconUrl ?? null} />;
}

export function TokenBadge({ slug }: { slug: string }) {
  const iconUrl = TOKEN_ICONS[slug];

  return <TextWithIcon text={slug} iconUrl={iconUrl ?? null} />;
}

export function TextWithIcon({ text, iconUrl }: { text: string; iconUrl: string | null }) {
  return (
    <div className="flex items-center space-x-1">
      {iconUrl && <Avatar size={6} src={iconUrl} alt="" />}
      <p className="text-black font-normal">{text}</p>
    </div>
  );
}
