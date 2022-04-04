import {
  Anchor,
  Button,
  ColorScheme,
  ColorSchemeProvider,
  createStyles,
  Group,
  MantineProvider
} from "@mantine/core";
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { ExitIcon } from "@radix-ui/react-icons";
import { FunctionComponent, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { LoginPage } from "./components/pages/LoginPage";
import { MainPage } from "./components/pages/MainPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { RegistrationPage } from "./components/pages/RegistrationPage";
import useAuthentication from "./hooks/UseAuthentication";
import "./config";
import { FriendPage } from "./components/pages/FriendPage";
import { ExtensionsPage } from "./components/pages/ExtensionsPage";
import ThemeToggle from "./components/ThemeToggle";

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 800,
    width: "100%"
  },
  testaustimeTitle: {
    paddingTop: 4,
    fontFamily: "Poppins, sans-serif",
    background:
      "linear-gradient(51deg, rgba(60,112,157,1) 0%, rgba(34,65,108,1) 100%)",
    fontSize: "2.5rem",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    textDecoration: "none"
  }
}));

const PrivateRoute: FunctionComponent = ({ children }) => {
  const { isLoggedOut } = useAuthentication();
  if (isLoggedOut) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppSetup = () => {
  const { logOut, isLoggedIn, refetchUsername, username } = useAuthentication();
  const navigate = useNavigate();
  const { classes } = useStyles();

  // Save colorScheme to localStorage and the default value is the preferred colorScheme
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "testaustime-color-scheme",
    defaultValue: preferredColorScheme
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    refetchUsername();
  }, []);

  const logOutAndRedirect = () => {
    logOut();
    navigate("/");
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme: colorScheme,
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
          }
        }}
      >
        <NotificationsProvider>
          <Group position="center" mt={80}>
            <div className={classes.container}>
              <Group position="apart" mb={50}>
                <Link to="/" className={classes.testaustimeTitle}>
                  Testaustime
                </Link>
                <Group spacing={15} align="center">
                  {!isLoggedIn && (
                    <Anchor component={Link} to="/login">
                      Login
                    </Anchor>
                  )}
                  {!isLoggedIn && (
                    <Button component={Link} to="/register">
                      Register
                    </Button>
                  )}
                  {isLoggedIn && (
                    <Anchor component={Link} to="/">
                      Dashboard
                    </Anchor>
                  )}
                  {isLoggedIn && (
                    <Anchor component={Link} to="/friends">
                      Friends
                    </Anchor>
                  )}
                  {isLoggedIn && (
                    <Anchor component={Link} to="/profile">
                      My profile
                    </Anchor>
                  )}
                  {isLoggedIn && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={logOutAndRedirect}
                      leftIcon={<ExitIcon />}
                    >
                      Log out {username}
                    </Button>
                  )}
                  <ThemeToggle />
                </Group>
              </Group>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <PrivateRoute>
                      <FriendPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/extensions" element={<ExtensionsPage />} />
              </Routes>
            </div>
          </Group>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
