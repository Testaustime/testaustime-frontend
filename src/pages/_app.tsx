import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ColorSchemeProvider, Group, MantineProvider, Overlay, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer/Footer";
import { useAuthentication } from "../hooks/useAuthentication";
import { useCreateSettings } from "../hooks/useSettings";
import { useHotkeys } from "@mantine/hooks";
import { SettingsContext } from "../contexts/SettingsContext";
import { AppSetup } from "../AppSetup";
import "../index.css";

const useStyles = createStyles(() => ({
  container: {
    maxWidth: "calc(800px + 10%)",
    width: "100%",
    minHeight: "100%",
    alignContent: "flex-start",
    paddingTop: 40,
    paddingBottom: 100
  },
  innerContainer: {
    minHeight: "100%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  testaustimeTitle: {
    paddingTop: 4,
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(51deg, rgba(60,112,157,1) 0%, rgba(34,65,108,1) 100%)",
    fontSize: "2.5rem",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    textDecoration: "none",
    "@media (max-width: 450px)": {
      width: "60%",
      fontSize: "8vw"
    }
  }
}));

const InnerApp = ({ Component, pageProps }: AppProps) => {
  const { classes } = useStyles();
  const [opened, setOpenedOriginal] = useState(false);

  const { refetchUser } = useAuthentication();

  const settings = useCreateSettings();

  useHotkeys([["mod+J", () => settings.toggleColorScheme()]]);

  useEffect(() => {
    refetchUser().catch(e => console.error(e));
  }, []);


  const setOpened = (o: boolean | ((arg0: boolean) => boolean)) => { // Patches a bug with Mantine menu alignment
    const state = typeof o === "function" ? o(opened) : o;

    // Disable scrolling
    if (state) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    // Open or close the menu
    setOpenedOriginal(state);
    requestAnimationFrame(() => {
      const dropdown = document.getElementById("dropdown-menu-dropdown");
      if (dropdown) dropdown.style.left = "0px";
    });
  };


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
        <Group className={classes.container}>
          {opened && <Overlay opacity={0.6} color="#000" zIndex={5} onClick={() => setOpened(false)} />}
          <div className={classes.innerContainer}>
            <div>
              <Group position="apart" mb={50}>
                <Link href="/" className={classes.testaustimeTitle}>
                  Testaustime
                </Link>
                <Navigation
                  opened={opened}
                  setOpened={setOpened}
                />
              </Group>
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
        </Group>
      </SettingsContext.Provider>
    </ColorSchemeProvider>
  </MantineProvider>;
};

function App(props: AppProps) {
  return <div id="root">
    <AppSetup>
      <InnerApp {...props} />
    </AppSetup>
  </div>;
}

export default appWithTranslation(App);
