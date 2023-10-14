import type { AppContext, AppInitialProps, AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import {
  Group,
  MantineColorScheme,
  MantineProvider,
  isMantineColorScheme,
} from "@mantine/core";
import { useCreateSettings } from "../hooks/useSettings";
import { useHotkeys } from "@mantine/hooks";
import { SettingsContext } from "../contexts/SettingsContext";
import "../index.css";
import axios from "../axios";
import { ApiUsersUserResponse } from "../hooks/useAuthentication";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { CookiesProvider } from "react-cookie";
import { colorSchemeCookieName } from "../utils/constants";
import Head from "next/head";
import styles from "./_app.module.css";
import "@mantine/core/styles.css";

type Props = {
  token?: string;
  username?: string;
  friendCode?: string;
  registrationTime?: Date;
  isPublic?: boolean;
  colorScheme: MantineColorScheme;
};

const InnerApp = ({ Component, pageProps }: AppProps<Props>) => {
  const settings = useCreateSettings({
    initialColorScheme: pageProps.colorScheme,
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
      defaultColorScheme={pageProps.colorScheme}
    >
      <Notifications />
      <ModalsProvider>
        <SettingsContext.Provider value={settings}>
          <Group className={styles.container}>
            <div className={styles.innerContainer}>
              <Component {...pageProps} />
            </div>
          </Group>
        </SettingsContext.Provider>
      </ModalsProvider>
    </MantineProvider>
  );
};

const queryClient = new QueryClient();

function App(props: AppProps<Props>) {
  return (
    <div id="root">
      <Head>
        <title>Testaustime</title>
      </Head>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <InnerApp {...props} />
        </QueryClientProvider>
      </CookiesProvider>
    </div>
  );
}

App.getInitialProps = async ({
  ctx,
}: AppContext): Promise<AppInitialProps<Props>> => {
  const token = ctx.req?.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.replace("token=", "");
  const colorSchemeUnchecked = ctx.req?.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith(`${colorSchemeCookieName}=`))
    ?.replace(`${colorSchemeCookieName}=`, "");

  const colorScheme = isMantineColorScheme(colorSchemeUnchecked)
    ? colorSchemeUnchecked
    : "dark";

  if (!token) {
    return {
      pageProps: {
        colorScheme,
      },
    };
  }

  try {
    const response = await axios.get<ApiUsersUserResponse>("/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": ctx.req?.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
    return {
      pageProps: {
        token,
        username: response.data.username,
        friendCode: response.data.friend_code,
        registrationTime: new Date(response.data.registration_time),
        isPublic: response.data.is_public,
        colorScheme,
      },
    };
  } catch (e) {
    return {
      pageProps: {
        colorScheme,
      },
    };
  }
};

export default appWithTranslation(App);
