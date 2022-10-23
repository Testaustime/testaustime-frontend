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

  return {
    smoothCharts,
    setSmoothCharts,
    language,
    setLanguage
  };
};

export const useSettings = () => useContext(SettingsContext);
