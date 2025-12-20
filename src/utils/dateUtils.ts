export const timeUnits = [
  { suffix: "y", value: 60 * 60 * 24 * 365 },
  { suffix: "mo", value: 60 * 60 * 24 * 30 },
  { suffix: "d", value: 60 * 60 * 24 },
  { suffix: "h", value: 60 * 60 },
  { suffix: "min", value: 60 },
  { suffix: "s", value: 1 },
] as const;

export type TimeUnit = (typeof timeUnits)[number]["suffix"];

export const prettyDuration = (
  seconds: number,
  maxTimeUnit: TimeUnit,
): string => {
  if (seconds <= 0) return "0s";

  let result = "";

  const startTimeUnitIndex = timeUnits.findIndex(
    (x) => x.suffix === maxTimeUnit,
  );

  const usableTimeUnits = timeUnits.slice(startTimeUnitIndex);
  for (const { suffix, value } of usableTimeUnits) {
    const count = Math.floor(seconds / value);
    if (count > 0) {
      result += String(count) + suffix + " ";
    }
    seconds %= value;
  }

  return result.trim();
};

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
