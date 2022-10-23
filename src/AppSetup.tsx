import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider
} from "@mantine/core";
import { useColorScheme, useHotkeys } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect } from "react";
import useAuthentication from "./hooks/UseAuthentication";
import { ModalsProvider } from "@mantine/modals";
import TypesafeI18n from "./i18n/i18n-react";
import { loadAllLocales } from "./i18n/i18n-util.sync";
import { useCreateSettings } from "./hooks/useSettings";
import {
  detectLocale, htmlLangAttributeDetector, navigatorDetector, queryStringDetector
} from "typesafe-i18n/detectors";
import { App } from "./components/App";
import { SettingsContext } from "./contexts/SettingsContext";
import { Locales } from "./i18n/i18n-types";

loadAllLocales();
const detectedLanguage = detectLocale<Locales>("en", ["en", "fi"],
  queryStringDetector,
  navigatorDetector,
  htmlLangAttributeDetector
);

export const AppSetup = () => {
  const { refetchUsername } = useAuthentication();

  const preferredColorScheme = useColorScheme();

  const settings = useCreateSettings();

  const colorScheme = (settings.colorScheme === undefined || settings.colorScheme === "none")
    ? preferredColorScheme
    : settings.colorScheme;

  const toggleColorScheme = (value?: ColorScheme) =>
    settings.setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    refetchUsername().catch(e => console.error(e));
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme: colorScheme,
          fontFamily: "Ubuntu, sans-serif",
          white: "#eee",
          black: "#121212",
          colors: {
            blue: [
              "#1D357F",
              "#28408A",
              "#667bc4",
              "#3D55A0",
              "#5084cc",
              "#536AB7",
              "#5E74C2",
              "#667bc4",
              "#6275bc",
              "#7E94E3"
            ]
          },
          headings: {
            fontFamily: "Poppins, sans-serif",
            fontWeight: 800,
            sizes: {
              h1: { fontSize: "1.9rem" },
              h2: { fontSize: "1.65rem" },
              h3: { fontSize: "1.4rem" }
            }
          },
          breakpoints: {
            md: 860
          }
        }}
      >
        <SettingsContext.Provider value={settings}>
          <TypesafeI18n
            locale={(settings.language || detectedLanguage) ?? "en"}
            key={(settings.language || detectedLanguage) ?? "en"}
          >
            <NotificationsProvider>
              <ModalsProvider>
                <App />
              </ModalsProvider>
            </NotificationsProvider>
          </TypesafeI18n>
        </SettingsContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
