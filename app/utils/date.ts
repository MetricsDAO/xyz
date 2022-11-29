import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function fromNow(time: string | number | Date) {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
}

export function countDown(date: Date | string) {
  const duration = dayjs(date).diff(dayjs());
  if (dayjs(date).diff(dayjs(), "month") >= 1) {
    return dayjs(duration).format("M[m] d[d] h[h]");
  } else if (dayjs(date).diff(dayjs(), "days") >= 1) {
    return dayjs(duration).format("d[d] h[h] m[m]");
  }

  return dayjs(duration).format("h[h] m[m] s[s]");
}
