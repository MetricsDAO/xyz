type Props = {
  iconType: string;
};

export function ActivityAvatar({ iconType }: Props) {
  return <img src={`/img/icons/activity-icons/${iconType}.svg`} alt="" />;
}
