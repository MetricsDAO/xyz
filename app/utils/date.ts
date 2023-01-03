import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

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

/**
 * Returns the unix timestamp (in seconds) of a date
 * @param date
 */
export function unixTimestamp(date: Date): number {
  return dayjs(date).unix();
}

/**
 * Converts string date and time to a Date object
 * @param date a date with format YYYY-MM-DD
 * @param time a time with format HH:mm
 */
export function customStringToDate(date: string, time: string): Date {
  return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm", true).toDate();
}

export function validateDate(date: string) {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
}

export function validateTime(time: string) {
  return dayjs(time, "HH:mm", true).isValid();
}
