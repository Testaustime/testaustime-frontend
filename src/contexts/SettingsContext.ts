import { ColorScheme } from "@mantine/core";
import { createContext } from "react";
import { Locales } from "../i18n/i18n-types";

export interface SettingsContextValue {
  smoothCharts: boolean,
  setSmoothCharts: (smoothCharts: boolean) => void,
  language?: Locales,
  setLanguage: (language: Locales) => void,
  // FIXME: "none" is obsolete, but still requires support. Can be removed in the future.
  colorScheme?: ColorScheme | "none",
  setColorScheme: (colorScheme: ColorScheme) => void
}

const defaultCallback = () => console.warn("SettingsContext not initialized");

const defaultValue: SettingsContextValue = {
  smoothCharts: true,
  setSmoothCharts: defaultCallback,
  language: undefined,
  setLanguage: defaultCallback,
  colorScheme: undefined,
  setColorScheme: defaultCallback
};

export const SettingsContext = createContext(defaultValue);
