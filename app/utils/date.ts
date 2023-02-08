import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export function fromNow(time: string | number | Date) {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
}

export function countDown(date: Date | string) {
  const duration = dayjs(date).diff(new Date(), "minute");
  if (dayjs(date).diff(dayjs(), "month") >= 1) {
    return dayjs.duration(duration, "minute").format("M[m] D[d] H[h]");
  } else if (dayjs(date).diff(dayjs(), "day") >= 1) {
    return dayjs.duration(duration, "minute").format("D[d] H[h] m[m]");
  }

  return dayjs.duration(duration, "minute").format("H[h] m[m] s[s]");
}

/**
 * Returns the unix timestamp (in seconds) of a date
 * @param date
 */
export function unixTimestamp(date: Date): number {
  return dayjs(date).unix();
}

/**
 * Returns a Date of a unix timestamp (in seconds)
 * @param seconds unix timestamp in seconds
 */
export function fromUnixTimestamp(seconds: number): Date {
  return dayjs.unix(seconds).toDate();
}

/**
 * Converts string date and time to a Date object
 * @param date a date with format YYYY-MM-DD
 * @param time a time with format HH:mm
 */
export function parseDatetime(date: string, time: string): Date {
  return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm", true).toDate();
}

export function validateDate(date: string) {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
}

export function validateTime(time: string) {
  return dayjs(time, "HH:mm", true).isValid();
}

export function dateHasPassed(date: Date) {
  return dayjs(date).diff() < 0;
}

export function progressTime(start: Date, end: Date): number {
  const denominator = dayjs(end).diff(start, "seconds");
  const numerator = dayjs(Date.now()).diff(start, "seconds");
  return Math.min(100, (numerator / denominator) * 100);
}

export function claimToReviewDate(createdAt: Date, enforcementExpiration: Date) {
  return new Date((enforcementExpiration.valueOf() - createdAt.valueOf()) * 0.75 + createdAt.valueOf());
}
