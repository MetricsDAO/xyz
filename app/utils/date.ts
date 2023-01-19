import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function fromNow(time: string | number | Date) {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
}

export function countDown(date: Date | string) {
  const duration = dayjs(date).diff();
  if (dayjs(date).diff(dayjs(), "month") >= 1) {
    return dayjs(duration).format("M[m] D[d] h[h]");
  } else if (dayjs(date).diff(dayjs(), "day") >= 1) {
    return dayjs(duration).format("D[d] h[h] m[m]");
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
  const denominator = dayjs(end).diff(start, "hours");
  const numerator = dayjs(Date.now()).diff(start, "hours") * 100;
  return Math.min(100, numerator / denominator);
}

export function claimToReviewDate(createdAt: Date, enforcementExpiration: Date) {
  return new Date((enforcementExpiration.valueOf() - createdAt.valueOf()) * 0.75 + createdAt.valueOf());
}
