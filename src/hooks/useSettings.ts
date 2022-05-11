import { useLocalStorageValue } from "@mantine/hooks";

export interface LocalStorageSettings {
  smoothCharts?: boolean
}

const defaultValue: LocalStorageSettings = {
  smoothCharts: true
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorageValue({
    key: "settings",
    defaultValue
  });

  const setSmoothCharts = (smoothCharts: boolean) => {
    setSettings({
      ...settings,
      smoothCharts
    });
  };

  return { ...settings, setSmoothCharts };
};