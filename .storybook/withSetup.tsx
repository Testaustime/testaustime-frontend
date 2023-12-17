import type { Decorator } from "@storybook/react";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";
import { useCreateSettings } from "../src/hooks/useSettings";
import { SettingsContext } from "../src/contexts/SettingsContext";
import { PropsWithChildren } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "i18next";
import en from "../public/locales/en/common.json";
import fi from "../public/locales/fi/common.json";
import "@mantine/core/styles.css";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
});

const InnerApp = ({ children }: PropsWithChildren) => {
  const settings = useCreateSettings({
    initialColorScheme: "dark",
  });

  return (
    <MantineProvider
      theme={{
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
            "#7E94E3",
          ],
          dark: [
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5c5f66",
            "#373A40",
            "#2C2E33",
            "#25262b",
            "#1A1B1E",
            "#141517",
            "#101113",
          ],
        },
        headings: {
          fontFamily: "Poppins, sans-serif",
          fontWeight: "800",
          sizes: {
            h1: { fontSize: "1.9rem" },
            h2: { fontSize: "1.65rem" },
            h3: { fontSize: "1.4rem" },
          },
        },
        breakpoints: {
          md: "53.75em",
        },
      }}
    >
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </MantineProvider>
  );
};

export const withSetup: Decorator = (Story) => {
  return (
    <div id="root">
      <I18nextProvider i18n={i18n}>
        <InnerApp>
          <ModalsProvider>
            <Notifications />
            <Story />
          </ModalsProvider>
        </InnerApp>
      </I18nextProvider>
    </div>
  );
};
