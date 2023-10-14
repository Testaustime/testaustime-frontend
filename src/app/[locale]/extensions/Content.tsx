"use client";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SettingsContext } from "../../../contexts/SettingsContext";
import { MantineColorScheme } from "@mantine/core";
import { useCreateSettings } from "../../../hooks/useSettings";
import { useHotkeys } from "@mantine/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

export const Content = ({
  children,
  colorScheme,
}: {
  children: React.ReactNode;
  colorScheme: MantineColorScheme;
}) => {
  const settings = useCreateSettings({
    initialColorScheme: colorScheme,
  });

  useHotkeys([
    [
      "mod+J",
      () => {
        settings.toggleColorScheme();
      },
    ],
  ]);

  return (
    <>
      <Notifications />
      <ModalsProvider>
        <CookiesProvider>
          <QueryClientProvider client={queryClient}>
            <SettingsContext.Provider value={settings}>
              {children}
            </SettingsContext.Provider>
          </QueryClientProvider>
        </CookiesProvider>
      </ModalsProvider>
    </>
  );
};
