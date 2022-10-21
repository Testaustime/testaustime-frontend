import { useLocalStorage } from "@mantine/hooks";
import { Locales } from "../i18n/i18n-types";

export interface LocalStorageSettings {
  smoothCharts?: boolean,
  language?: Locales
}

const defaultValue: LocalStorageSettings = {
  smoothCharts: true,
  language: undefined
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage({
    key: "settings",
    defaultValue
  });

  const setSmoothCharts = (smoothCharts: boolean) => {
    setSettings({
      ...settings,
      smoothCharts
    });
  };

  const setLanguage = (language: Locales) => {
    setSettings({
      ...settings,
      language
    });
  };

  return {
    ...settings,
    setSmoothCharts,
    setLanguage
  };
};
