import { createContext } from "react";
import { Locales } from "../i18n/i18n-types";

export interface SettingsContextValue {
  smoothCharts: boolean,
  setSmoothCharts: (smoothCharts: boolean) => void,
  language?: Locales,
  setLanguage: (language: Locales) => void
}

const defaultValue: SettingsContextValue = {
  smoothCharts: true,
  setSmoothCharts: () => console.warn("SettingsContext is not initialized"),
  language: undefined,
  setLanguage: () => console.warn("SettingsContext is not initialized")
};

export const SettingsContext = createContext(defaultValue);
