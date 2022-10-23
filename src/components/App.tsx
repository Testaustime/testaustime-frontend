import { Anchor, Box, Burger, Button, ColorScheme, createStyles, Divider, Group, Menu, Overlay } from "@mantine/core";
import {
  EnterIcon, ExitIcon, FaceIcon, GearIcon, HomeIcon, MixIcon, PersonIcon, PlusIcon
} from "@radix-ui/react-icons";
import { useState } from "react";
import { BarChart2 } from "react-feather";
import { Link, Route, Routes } from "react-router-dom";
import useAuthentication from "../hooks/UseAuthentication";
import { useI18nContext } from "../i18n/i18n-react";
import { Footer } from "./Footer";
import { NotFoundPage } from "./NotFoundPage";
import { ExtensionsPage } from "./pages/ExtensionsPage";
import { FriendPage } from "./pages/FriendPage";
import { LeaderboardsPage } from "./pages/LeaderboardsPage";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { PrivateRoute } from "./PrivateRoute";
import ThemeToggle from "./ThemeToggle";

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
  const { isLoggedIn, username } = useAuthentication();
  const { classes } = useStyles();
  const [opened, setOpenedOriginal] = useState(false);

  const { LL } = useI18nContext();

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
          <Group>
            <Group spacing={15} align="center" className={classes.navigation}>
              <Group>
                {isLoggedIn ? <>
                  <Anchor component={Link} to="/">{LL.navbar.dashboard()}</Anchor>
                  <Anchor component={Link} to="/friends">{LL.navbar.friends()}</Anchor>
                  <Anchor component={Link} to="/leaderboards">{LL.navbar.leaderboards()}</Anchor>
                  <Menu
                    trigger="hover"
                  >
                    <Menu.Target>
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<PersonIcon style={{ marginRight: "5px" }} />}
                      >
                        {username}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>{LL.navbar.account()}</Menu.Label>
                      <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>{LL.navbar.settings()}</Menu.Item>
                      <Divider />
                      <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                        {LL.navbar.extensions()}
                      </Menu.Item>
                      <Divider />
                      <Menu.Item
                        color="blue"
                        icon={<ExitIcon />}
                        onClick={logOutAndRedirect}>
                        {LL.navbar.logOut()}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </> : <>
                  <Anchor component={Link} to="/extensions">{LL.navbar.extensions()}</Anchor>
                  <Box className={classes.spacer} />
                  <Anchor component={Link} to="/login">{LL.navbar.login()}</Anchor>
                  <Button component={Link} to="/register">{LL.navbar.register()}</Button>
                </>}
              </Group>
              <ThemeToggle label={false} />
            </Group>
            <Group className={classes.smallNavigation}>
              <Menu
                opened={opened}
                id="dropdown-menu"
                transition={"fade"}
                position={"left-end"}
                transitionDuration={150}
              >
                <Menu.Target>
                  <Burger
                    title="Open navigation"
                    opened={opened}
                    color={"#536ab7"}
                    sx={{ zIndex: 5 }}
                    onClick={() => setOpened((o: boolean) => !o)}
                  />
                </Menu.Target>
                <Menu.Dropdown
                  className={`${classes.dropdown} noDefaultTransition`}
                  onClick={() => setOpened(false)}
                >
                  <div
                    style={{ padding: "10px" }}
                    onClick={() => { toggleColorScheme(); }}>
                    <ThemeToggle label={true} />
                  </div>
                  {isLoggedIn ?
                    <>
                      <Divider />
                      <Menu.Item component={Link} to="/" icon={<HomeIcon />}>{LL.navbar.dashboard()}</Menu.Item>
                      <Menu.Item component={Link} to="/friends" icon={<FaceIcon />}>{LL.navbar.friends()}</Menu.Item>
                      <Menu.Item
                        component={Link}
                        to="/leaderboards"
                        icon={<BarChart2 size={18} />}
                      >
                        {LL.navbar.leaderboards()}
                      </Menu.Item>
                      <Divider />
                      <Menu.Label>{LL.navbar.account()} - {username}</Menu.Label>
                      <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>{LL.navbar.settings()}</Menu.Item>
                      <Divider />
                      <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                        {LL.navbar.extensions()}
                      </Menu.Item>
                      <Divider />
                      <Menu.Item color="blue" icon={<ExitIcon />} onClick={logOutAndRedirect}>
                        {LL.navbar.logOut()}
                      </Menu.Item>
                    </>
                    :
                    <>
                      <Divider />
                      <Menu.Item component={Link} to="/login" icon={<EnterIcon />}>{LL.navbar.login()}</Menu.Item>
                      <Menu.Item color="blue" component={Link} to="/register" icon={<PlusIcon />}>
                        {LL.navbar.register()}
                      </Menu.Item>
                      <Divider />
                      <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>
                        {LL.navbar.extensions()}
                      </Menu.Item>
                    </>}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
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
