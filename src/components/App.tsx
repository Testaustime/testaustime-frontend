import { ColorScheme, createStyles, Group, Overlay } from "@mantine/core";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";
import { NotFoundPage } from "./NotFoundPage";
import { ExtensionsPage } from "./pages/ExtensionsPage";
import { FriendPage } from "./pages/FriendPage";
import { LeaderboardsPage } from "./pages/LeaderboardsPage";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { PrivateRoute } from "./PrivateRoute";

const useStyles = createStyles(theme => ({
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
  },
  profileButton: {
    display: "flex"
  },
  navigation: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "none"
    }
  },
  smallNavigation: {
    display: "none",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "flex"
    },
    "@media (max-width: 450px)": {
      width: "39%"
    }
  },
  spacer: {
    width: "10px",
    height: "1px",
    backgroundColor: theme.colorScheme === "dark" ? "#bbb" : "#333"
  },
  menu: {
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.gray[1]}`
  },
  dropdown: {
    width: "90%",
    margin: "calc(40px + 36px + 20px) 5% 0 5%",
    padding: "10px",
    zIndex: 5
  }
}));

interface AppProps {
  logOutAndRedirect: () => void,
  toggleColorScheme: (value?: ColorScheme) => void
}

export const App = ({ logOutAndRedirect, toggleColorScheme }: AppProps) => {
  const { classes } = useStyles();
  const [opened, setOpenedOriginal] = useState(false);

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

  return <Group className={classes.container}>
    {opened ? <Overlay opacity={0.6} color="#000" zIndex={5} onClick={() => setOpened(false)} /> : <></>}
    <div className={classes.innerContainer}>
      <div>
        <Group position="apart" mb={50}>
          <Link to="/" className={classes.testaustimeTitle}>
            Testaustime
          </Link>
          <Navigation
            logOutAndRedirect={logOutAndRedirect}
            toggleColorScheme={toggleColorScheme}
            opened={opened}
            setOpened={setOpened}
          />
        </Group>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/profile"
            element={<PrivateRoute redirect="/profile"><ProfilePage /></PrivateRoute>} />
          <Route
            path="/friends"
            element={<PrivateRoute redirect="/friends"><FriendPage /></PrivateRoute>} />
          <Route
            path="/leaderboards"
            element={<PrivateRoute redirect="/leaderboards"><LeaderboardsPage /></PrivateRoute>} />
          <Route path="/extensions" element={<ExtensionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </Group>;
};
