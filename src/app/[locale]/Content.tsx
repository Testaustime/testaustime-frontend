"use client";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SettingsContext } from "../../contexts/SettingsContext";
import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";
import { useCreateSettings } from "../../hooks/useSettings";
import { useHotkeys } from "@mantine/hooks";
import { CookiesProvider } from "react-cookie";
import styles from "./Content.module.css";

export const Content = ({
  children,
  colorScheme,
}: {
  children: React.ReactNode;
  colorScheme: MantineColorScheme;
}) => {
  const mantineColorScheme = useMantineColorScheme();
  const settings = useCreateSettings({
    initialColorScheme: colorScheme,
  });

  useHotkeys([
    [
      "mod+J",
      () => {
        settings.toggleColorScheme();
        mantineColorScheme.toggleColorScheme();
      },
    ],
  ]);

  return (
    <>
      <Notifications />
      <ModalsProvider>
        <div className={styles.container}>
          <CookiesProvider>
            <SettingsContext.Provider value={settings}>
              {children}
            </SettingsContext.Provider>
          </CookiesProvider>
        </div>
      </ModalsProvider>
    </>
  );
};
