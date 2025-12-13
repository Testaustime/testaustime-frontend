import { createContext } from "react";
import { DayRange } from "../utils/dateUtils";
import { Locales } from "../i18next";
import { MantineColorScheme } from "@mantine/core";

interface SettingsContextValue {
  smoothCharts: boolean;
  setSmoothCharts: (smoothCharts: boolean) => void;
  language?: Locales;
  setLanguage: (language: Locales) => void;
  // FIXME: "none" is obsolete, but still requires support. Can be removed in the future.
  colorScheme?: MantineColorScheme | "none";
  setColorScheme: (colorScheme: MantineColorScheme) => void;
  defaultDayRange?: DayRange;
  setDefaultDayRange: (defaultDayRange: DayRange) => void;
  timeInHours: boolean;
  setTimeInHours: (timeInHours: boolean) => void;
}

const defaultCallback = () => {
  console.warn("SettingsContext not initialized");
};

const defaultValue: SettingsContextValue = {
  smoothCharts: true,
  setSmoothCharts: defaultCallback,
  language: undefined,
  setLanguage: defaultCallback,
  colorScheme: undefined,
  setColorScheme: defaultCallback,
  defaultDayRange: undefined,
  setDefaultDayRange: defaultCallback,
  timeInHours: false,
  setTimeInHours: defaultCallback,
};

export const SettingsContext = createContext(defaultValue);
