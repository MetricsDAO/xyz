type Props = {
  groupType: string;
};

export function ActivityAvatar({ groupType }: Props) {
  return <img src={`/img/icons/activity-icons/${groupType}.svg`} alt="" />;
}
