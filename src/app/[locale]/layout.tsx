import { Group, MantineProvider } from "@mantine/core";
import styles from "../../pages/_app.module.css";
import "@mantine/core/styles.css";
import { Content } from "./extensions/Content";
import { cookies } from "next/headers";
import { colorSchemeCookieName } from "../../utils/constants";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer/Footer";
import "../../index.css";
import initTranslations from "../i18n";
import axios from "../../axios";
import { ApiUsersUserResponse } from "../../hooks/useAuthentication";

export const metadata = {
  title: "Testaustime",
};

const isMantineColorScheme = (
  value: string | undefined,
): value is "light" | "dark" | "auto" =>
  value === "light" || value === "dark" || value === "auto";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  const colorSchemeUnchecked = cookies().get(colorSchemeCookieName)?.value;
  const colorScheme = isMantineColorScheme(colorSchemeUnchecked)
    ? colorSchemeUnchecked
    : "dark";

  const token = cookies().get("token")?.value;

  let username = undefined;
  try {
    const response = await axios.get<ApiUsersUserResponse>("/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
        // "X-Forwarded-For": ctx.req?.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
    username = response.data.username;
  } catch {
    username = undefined;
  }

  return (
    <html lang="en">
      <body id="root">
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
          defaultColorScheme={"dark"}
        >
          <Content colorScheme={colorScheme}>
            <Group className={styles.container}>
              <div className={styles.innerContainer}>
                <div>
                  <Group justify="space-between" mb={50}>
                    <Link
                      href={"/" + locale}
                      className={styles.testaustimeTitle}
                    >
                      Testaustime
                    </Link>
                    <Navigation
                      isLoggedIn={!!token}
                      username={username}
                      t={t}
                      locale={locale}
                    />
                  </Group>
                  {children}
                </div>
                <Footer t={t} locale={locale} />
              </div>
            </Group>
          </Content>
        </MantineProvider>
      </body>
    </html>
  );
}
