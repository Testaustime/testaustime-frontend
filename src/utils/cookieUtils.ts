import { cookies } from "next/headers";
import {
  DEFAULT_DAY_RANGE,
  defaultDayRangeCookieName,
  smoothChartsCookieName,
  timeInHoursCookieName,
} from "./constants";
import { isDayRange } from "./dateUtils";

export const getPreferences = () => {
  const uncheckedDefaultDayRange = cookies().get(defaultDayRangeCookieName)
    ?.value;
  const defaultDayRange = isDayRange(uncheckedDefaultDayRange)
    ? uncheckedDefaultDayRange
    : undefined;
  const smoothCharts =
    (cookies().get(smoothChartsCookieName)?.value || "true") === "true";
  const timeInHours =
    (cookies().get(timeInHoursCookieName)?.value || "false") === "true";

  return {
    dayRange: defaultDayRange ?? DEFAULT_DAY_RANGE,
    smoothCharts,
    maxTimeUnit: timeInHours ? ("h" as const) : ("y" as const),
  };
};
