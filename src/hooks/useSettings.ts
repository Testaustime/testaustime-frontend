import { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { Locales } from "../i18n/i18n-types";

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

  return {
    smoothCharts,
    setSmoothCharts,
    language,
    setLanguage,
    colorScheme,
    setColorScheme
  };
};

export const useSettings = () => useContext(SettingsContext);
