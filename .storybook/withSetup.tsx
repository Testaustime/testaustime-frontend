import type { Decorator } from "@storybook/react";
import { UserContext } from "../src/contexts/UserContext";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useCreateSettings } from "../src/hooks/useSettings";
import { SettingsContext } from "../src/contexts/SettingsContext";
import { PropsWithChildren } from "react";
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import en from "../public/locales/en/common.json";
import fi from "../public/locales/fi/common.json";

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    fi: { translation: fi }
  }
});

const InnerApp = ({ children }: PropsWithChildren) => {
  const settings = useCreateSettings();

  return <MantineProvider
    withGlobalStyles
    theme={{
      colorScheme: settings.colorScheme,
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
        md: "53.75em"
      }
    }}
  >
    <ColorSchemeProvider
      colorScheme={settings.colorScheme}
      toggleColorScheme={settings.toggleColorScheme}
    >
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </ColorSchemeProvider>
  </MantineProvider>;
}

export const withSetup: Decorator = (Story) => {
  return <div id="root">
    <UserContext.Provider value={{
      authToken: "myauthtoken",
      friendCode: "myfriendcode",
      isPublic: true,
      registrationTime: new Date(),
      username: "myusername"
    }}>
      <I18nextProvider i18n={i18n}>
        <Notifications />
        <ModalsProvider>
          <InnerApp>
            <Story />
          </InnerApp>
        </ModalsProvider>
      </I18nextProvider>
    </UserContext.Provider>
  </div>
};
