import { useLocalStorage } from "@mantine/hooks";

export interface LocalStorageSettings {
  smoothCharts?: boolean
}

const defaultValue: LocalStorageSettings = {
  smoothCharts: true
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

  return { ...settings, setSmoothCharts };
};
