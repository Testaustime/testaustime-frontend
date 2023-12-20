import { formatDuration, intervalToDuration } from "date-fns";

const formatShort = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}min",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  xMonths: "{{count}}mo",
  xYears: "{{count}}y",
};

const isImplementedToken = (
  token: unknown,
): token is keyof typeof formatShort =>
  typeof token === "string" && token in formatShort;

export const prettyDuration = (seconds: number) =>
  formatDuration(
    intervalToDuration({
      start: 0,
      end: Math.round(((seconds || 0) * 1000) / 60000) * 60000,
    }),
    {
      locale: {
        formatDistance: (token, count) => {
          if (isImplementedToken(token)) {
            return formatShort[token].replace("{{count}}", String(count));
          } else {
            console.warn("Unimplemented token", token);
            return "";
          }
        },
      },
    },
  ) || "None";

const DAY_RANGE_VALUES = ["month", "week", "all"] as const;
export type DayRange = (typeof DAY_RANGE_VALUES)[number];
export const isDayRange = (value: unknown): value is DayRange =>
  DAY_RANGE_VALUES.includes(value as DayRange);

export const getDayCount = (dayRange: Omit<DayRange, "all">) => {
  switch (dayRange) {
    case "month":
      return 30;
    case "week":
      return 7;
    default:
      throw new Error("Invalid day range");
  }
};
