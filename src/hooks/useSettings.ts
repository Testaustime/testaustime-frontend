import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { DayRange, TimeUnit } from "../utils/dateUtils";
import { Locales } from "../i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import {
  colorSchemeCookieName,
  DEFAULT_MAX_TIME_UNIT,
  defaultDayRangeCookieName,
  languageCookieName,
  smoothChartsCookieName,
  maxTimeUnitCookieName,
} from "../utils/constants";
import { MantineColorScheme } from "@mantine/core";
import { i18nConfig } from "../i18nConfig";

export const useCreateSettings = ({
  initialColorScheme,
}: {
  initialColorScheme: MantineColorScheme;
}) => {
  const router = useRouter();
  const [cookies, setCookies] = useCookies();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultCookieSettings: Parameters<typeof setCookies>[2] = {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    sameSite: "strict",
  };

  const smoothCharts = cookies[smoothChartsCookieName] as boolean | undefined;
  const setSmoothCharts = (value: boolean) => {
    setCookies(smoothChartsCookieName, value, defaultCookieSettings);
  };

  const language = (cookies[languageCookieName] || "en") as Locales;
  const setLanguage = (value: Locales) => {
    setCookies(languageCookieName, value, defaultCookieSettings);
  };

  const colorScheme = cookies[colorSchemeCookieName] as
    | MantineColorScheme
    | undefined;
  const setColorScheme = (value?: MantineColorScheme) => {
    setCookies(colorSchemeCookieName, value, defaultCookieSettings);
  };

  const toggleColorScheme = (value?: MantineColorScheme) => {
    setColorScheme(
      value || (!colorScheme || colorScheme === "dark" ? "light" : "dark"),
    );
  };

  const defaultDayRange = cookies[defaultDayRangeCookieName] as
    | DayRange
    | undefined;
  const setDefaultDayRange = (value?: DayRange) => {
    setCookies(defaultDayRangeCookieName, value, defaultCookieSettings);
  };

  const maxTimeUnit = cookies[maxTimeUnitCookieName] as TimeUnit | undefined;
  const setMaxTimeUnit = (value: TimeUnit) => {
    setCookies(maxTimeUnitCookieName, value, defaultCookieSettings);
  };

  return {
    smoothCharts: smoothCharts ?? true,
    setSmoothCharts,
    language,
    setLanguage: (value: Locales) => {
      setLanguage(value);
      const pathnameWithoutLanguage = pathname.replace(
        new RegExp(`/(${Object.values(i18nConfig.locales).join("|")})/?`),
        "/",
      );

      let path = "/" + value + "/" + pathnameWithoutLanguage;
      if (searchParams.size > 0) {
        path += "?" + searchParams.toString();
      }

      router.push(path);
    },
    colorScheme: colorScheme || initialColorScheme,
    setColorScheme,
    toggleColorScheme,
    defaultDayRange: defaultDayRange ?? "week",
    setDefaultDayRange,
    maxTimeUnit: maxTimeUnit ?? DEFAULT_MAX_TIME_UNIT,
    setMaxTimeUnit,
  };
};

export const useSettings = () => useContext(SettingsContext);
