import type { Project } from "@prisma/client";

type Props = {
  eventType: string;
};

export function ActivityAvatar({ eventType }: Props) {
  return <img src={`/img/icons/activity-icons/${eventType}.svg`} alt="" />;
}
