import { ColorScheme } from "@mantine/core";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { DayRange } from "../utils/dateUtils";
import { Locales } from "../i18next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import {
  colorSchemeCookieName,
  defaultDayRangeCookieName,
  languageCookieName,
  smoothChartsCookieName,
} from "../utils/constants";

export const useCreateSettings = ({
  initialColorScheme,
}: {
  initialColorScheme: ColorScheme;
}) => {
  const router = useRouter();
  const [cookies, setCookies] = useCookies();

  const defaultCookieSettings: Parameters<typeof setCookies>[2] = {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    sameSite: "strict",
  };

  const smoothCharts = cookies[smoothChartsCookieName] as
    | "true"
    | "false"
    | undefined;
  const setSmoothCharts = (value: boolean) => {
    setCookies(smoothChartsCookieName, value, defaultCookieSettings);
  };

  const language = (cookies[languageCookieName] || "en") as Locales;
  const setLanguage = (value: Locales) => {
    setCookies(languageCookieName, value, defaultCookieSettings);
  };

  const colorScheme = cookies[colorSchemeCookieName] as ColorScheme | undefined;
  const setColorScheme = (value?: ColorScheme) => {
    setCookies(colorSchemeCookieName, value, defaultCookieSettings);
  };

  const toggleColorScheme = (value?: ColorScheme) => {
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

  return {
    smoothCharts: (smoothCharts || "true") === "true",
    setSmoothCharts,
    language,
    setLanguage: (value: Locales) => {
      router
        .push(router.asPath, undefined, { locale: value })
        .catch(console.error);
      setLanguage(value);
    },
    colorScheme: colorScheme || initialColorScheme,
    setColorScheme,
    toggleColorScheme,
    defaultDayRange: defaultDayRange ?? "week",
    setDefaultDayRange,
  };
};

export const useSettings = () => useContext(SettingsContext);
