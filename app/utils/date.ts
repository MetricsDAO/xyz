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

/**
 * Returns a number between 0 and 100 representing how much time (in scale of seconds) has passed between start and end
 * @param start
 * @param end
 * @returns {number} between 0 and 100
 */
export function progressTime(start: Date, end: Date): number {
  if (dateHasPassed(end)) {
    return 100;
  }
  const denominator = dayjs(end).diff(start, "seconds");
  const numerator = dayjs(Date.now()).diff(start, "seconds");
  return Math.min(100, (numerator / denominator) * 100);
}

export function claimDate(createdAt: Date, expiration: Date) {
  return new Date((expiration.valueOf() - createdAt.valueOf()) * 0.75 + createdAt.valueOf());
}
