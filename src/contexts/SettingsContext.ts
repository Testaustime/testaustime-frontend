import { ColorScheme } from "@mantine/core";
import { createContext } from "react";
import { DayRange } from "../utils/dateUtils";
import { Locales } from "../i18next";

export interface SettingsContextValue {
  smoothCharts: boolean;
  setSmoothCharts: (smoothCharts: boolean) => void;
  language?: Locales;
  setLanguage: (language: Locales) => void;
  // FIXME: "none" is obsolete, but still requires support. Can be removed in the future.
  colorScheme?: ColorScheme | "none";
  setColorScheme: (colorScheme: ColorScheme) => void;
  defaultDayRange?: DayRange;
  setDefaultDayRange: (defaultDayRange: DayRange) => void;
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
};

export const SettingsContext = createContext(defaultValue);
