import { Group, MantineProvider } from "@mantine/core";
import styles from "./layout.module.css";
import "@mantine/core/styles.css";
import { Content } from "./Content";
import { cookies } from "next/headers";
import { colorSchemeCookieName } from "../../utils/constants";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer/Footer";
import "../../index.css";
import initTranslations from "../i18n";
import "@mantine/notifications/styles.css";
import TranslationsProvider from "../../components/TranslationsProvider";
import { getMe } from "../../api/usersApi";
import { Ubuntu, Poppins } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-ubuntu",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: "800",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Testaustime",
};

const isMantineColorScheme = (
  value: string | undefined,
): value is "light" | "dark" | "auto" =>
  value === "light" || value === "dark" || value === "auto";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  const { t, options } = await initTranslations(locale, ["common"]);

  const colorSchemeUnchecked = cookies().get(colorSchemeCookieName)?.value;
  const colorScheme = isMantineColorScheme(colorSchemeUnchecked)
    ? colorSchemeUnchecked
    : "dark";

  let username = undefined;
  const me = await getMe();
  if (me) {
    if ("error" in me) {
      if (me.error === "Unauthorized") {
        // Can't redirect to /login because it would cause an infinite loop
        console.log("User has token but it is invalid");
      } else if (me.error === "Too many requests") {
        // Can't redirect to /rate-limited because it would cause an infinite loop
        console.log("User has token but it is rate limited");
      } else {
        throw new Error(me.error);
      }
    } else {
      username = me.username;
    }
  }

  return (
    <html lang="en" className={`${ubuntu.variable} ${poppins.variable}`}>
      <body>
        <TranslationsProvider
          locale={locale}
          namespaces={
            options.ns
              ? typeof options.ns === "string"
                ? [options.ns]
                : [...options.ns]
              : ["common"]
          }
        >
          <MantineProvider
            theme={{
              fontFamily: "var(--font-ubuntu), sans-serif",
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
                fontFamily: "var(--font-poppins), sans-serif",
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
                        isLoggedIn={!!username}
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
        </TranslationsProvider>
      </body>
    </html>
  );
}
