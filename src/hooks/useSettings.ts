import { ColorScheme } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { DayRange } from "../utils/dateUtils";
import { Locales } from "../i18next";
import { useRouter } from "next/router";

export const useCreateSettings = () => {
  const router = useRouter();

  const [smoothCharts, setSmoothCharts] = useLocalStorage({
    key: "testaustime-smooth-charts",
    defaultValue: true
  });

  const [language, setLanguage] = useLocalStorage<Locales | undefined>({
    key: "testaustime-language",
    defaultValue: undefined,
    deserialize: value => value.replaceAll("\"", "") as Locales,
    serialize: value => value ?? "en"
  });

  // FIXME: "none" is obsolete, but still requires support. Can be removed in the future.
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme | undefined | "none">({
    key: "testaustime-color-scheme",
    defaultValue: undefined
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (!colorScheme || colorScheme === "dark" ? "light" : "dark"));

  const preferredColorScheme = useColorScheme();
  const finalColorScheme = (colorScheme === undefined || colorScheme === "none")
    ? preferredColorScheme
    : colorScheme;

  const [defaultDayRange, setDefaultDayRange] = useLocalStorage<DayRange | undefined>({
    key: "testaustime-default-day-count",
    defaultValue: undefined
  });

  return {
    smoothCharts,
    setSmoothCharts,
    language,
    setLanguage: (value: Locales) => {
      router.push(router.asPath, undefined, { locale: value }).catch(console.error);
      setLanguage(value);
    },
    colorScheme: finalColorScheme,
    setColorScheme,
    toggleColorScheme,
    defaultDayRange: defaultDayRange ?? "week",
    setDefaultDayRange
  };
};

export const useSettings = () => useContext(SettingsContext);
