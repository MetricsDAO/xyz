import { Avatar, Text } from "@mantine/core";
import { PROJECT_ICONS } from "~/utils/helpers";

export function ProjectBadge({ slug }: { slug: string }) {
  const iconUrl = PROJECT_ICONS[slug];

  return <TextWithIcon text={slug} iconUrl={iconUrl ?? null} />;
}

export function TextWithIcon({ text, iconUrl }: { text: string; iconUrl: string | null }) {
  return (
    <div className="flex items-center space-x-1">
      {iconUrl && <Avatar size="sm" src={iconUrl} />}
      <Text color="dark.3" weight={400}>
        {text}
      </Text>
    </div>
  );
}
