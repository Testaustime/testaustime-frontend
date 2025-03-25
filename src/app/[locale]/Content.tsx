"use client";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SettingsContext } from "../../contexts/SettingsContext";
import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";
import { useCreateSettings } from "../../hooks/useSettings";
import { useHotkeys } from "@mantine/hooks";
import { CookiesProvider } from "react-cookie";
import styles from "./Content.module.css";

const InnerContent = ({
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
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </>
  );
};

export const Content = ({
  children,
  colorScheme,
}: {
  children: React.ReactNode;
  colorScheme: MantineColorScheme;
}) => {
  return (
    <>
      <Notifications />
      <ModalsProvider>
        <div className={styles.container}>
          <CookiesProvider>
            <InnerContent colorScheme={colorScheme}>{children}</InnerContent>
          </CookiesProvider>
        </div>
      </ModalsProvider>
    </>
  );
};
