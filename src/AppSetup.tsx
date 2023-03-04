import {
  ColorSchemeProvider,
  MantineProvider
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useAuthentication } from "./hooks/useAuthentication";
import { ModalsProvider } from "@mantine/modals";
import { useCreateSettings } from "./hooks/useSettings";
import { SettingsContext } from "./contexts/SettingsContext";
import { QueryClient, QueryClientProvider } from "react-query";
// eslint-disable-next-line
import i18n from "./i18n/i18n";

const queryClient = new QueryClient();

const AppSetupInner = ({ children }: { children?: React.ReactNode }) => {
  const { refetchUser } = useAuthentication();

  const settings = useCreateSettings();

  useHotkeys([["mod+J", () => settings.toggleColorScheme()]]);

  useEffect(() => {
    refetchUser().catch(e => console.error(e));
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={settings.colorScheme}
      toggleColorScheme={settings.toggleColorScheme}
    >
      <MantineProvider
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
        <SettingsContext.Provider value={settings}>
          <Notifications />
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </SettingsContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export const AppSetup = ({ children }: { children?: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>
    <AppSetupInner>
      {children}
    </AppSetupInner>
  </QueryClientProvider>;
};
