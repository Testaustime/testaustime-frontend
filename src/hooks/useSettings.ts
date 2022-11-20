import { ColorScheme } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { Locales } from "../i18n/i18n-types";
import { DayRange } from "../utils/dateUtils";

export const useCreateSettings = () => {
  const [smoothCharts, setSmoothCharts] = useLocalStorage({
    key: "testaustime-smooth-charts",
    defaultValue: true
  });

  const [language, setLanguage] = useLocalStorage<Locales | undefined>({
    key: "testaustime-language",
    defaultValue: undefined
  });

  // FIXME: "none" is obsolete, but still requires support. Can be removed in the future.
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme | undefined | "none">({
    key: "testaustime-color-scheme",
    defaultValue: undefined
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

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
    setLanguage,
    colorScheme: finalColorScheme,
    setColorScheme,
    toggleColorScheme,
    defaultDayRange: defaultDayRange ?? "week",
    setDefaultDayRange
  };
};

export const useSettings = () => useContext(SettingsContext);
