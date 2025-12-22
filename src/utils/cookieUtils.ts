import { cookies } from "next/headers";
import {
  DEFAULT_DAY_RANGE,
  defaultDayRangeCookieName,
  smoothChartsCookieName,
  maxTimeUnitCookieName,
  DEFAULT_MAX_TIME_UNIT,
  wrapped2025CookieName,
} from "./constants";
import { isDayRange, TimeUnit } from "./dateUtils";

export const getPreferences = () => {
  const uncheckedDefaultDayRange = cookies().get(
    defaultDayRangeCookieName,
  )?.value;
  const defaultDayRange = isDayRange(uncheckedDefaultDayRange)
    ? uncheckedDefaultDayRange
    : undefined;
  const smoothCharts =
    (cookies().get(smoothChartsCookieName)?.value || "true") === "true";
  const maxTimeUnit =
    cookies().get(maxTimeUnitCookieName)?.value || DEFAULT_MAX_TIME_UNIT;
  const wrapped2025Hidden =
    cookies().get(wrapped2025CookieName)?.value === "true";

  return {
    dayRange: defaultDayRange ?? DEFAULT_DAY_RANGE,
    smoothCharts,
    maxTimeUnit: maxTimeUnit as unknown as TimeUnit,
    wrapped2025Hidden,
  };
};
