import { Anchor, Button, Group, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { ExitIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LoginPage } from "./components/pages/LoginPage";
import { MainPage } from "./components/pages/MainPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { RegistrationPage } from "./components/pages/RegistrationPage";
import useAuthentication from "./hooks/UseAuthentication";
import "./config";
import { FriendPage } from "./components/pages/FriendPage";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
`;

const TestaustimeTitle = styled(Link)`
  padding-top: 4px;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(51deg, rgba(60,112,157,1) 0%, rgba(34,65,108,1) 100%);
  font-size: 2.5rem;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-decoration: none;
`;

export const AppSetup = () => {
  const { logOut, isLoggedIn, refetchUsername, username } = useAuthentication();
  const navigate = useNavigate();
  const preferredColorScheme = useColorScheme();

  useEffect(() => {
    refetchUsername();
  }, []);

  const logOutAndRedirect = () => {
    logOut();
    navigate("/");
  };

  return <MantineProvider
    withGlobalStyles
    theme={{
      colorScheme: preferredColorScheme,
      fontFamily: "'Ubuntu', sans-serif",
      white: "#eee",
      black: "#121212",
      colors: {
        blue: ["#1D357F", "#28408A", "#667bc4", "#3D55A0", "#5084cc", "#536AB7", "#5E74C2", "#667bc4", "#6275bc", "#7E94E3"]
      },
      headings: {
        fontFamily: "Poppins, sans-serif",
        fontWeight: 800,
        sizes: {
          h1: { fontSize: "1.9rem" },
          h2: { fontSize: "1.65rem" },
          h3: { fontSize: "1.4rem" },
        }
      }
    }}
  >
    <NotificationsProvider>
      <Layout>
        <Container>
          <Group position="apart" mb={50}>
            <TestaustimeTitle to="/">
              Testaustime
            </TestaustimeTitle>
            <Group spacing={15} align="center">
              {!isLoggedIn && <Anchor component={Link} to="/login">Login</Anchor>}
              {!isLoggedIn && <Button component={Link} to="/register">Register</Button>}
              {isLoggedIn && <Anchor component={Link} to="/friends">Friends</Anchor>}
              {isLoggedIn && <Anchor component={Link} to="/profile">My profile</Anchor>}
              {isLoggedIn && <Button variant="outline" size="xs" onClick={logOutAndRedirect} leftIcon={<ExitIcon />}>Log out {username}</Button>}
            </Group>
          </Group>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendPage />} />
          </Routes>
        </Container>
      </Layout>
    </NotificationsProvider>
  </MantineProvider>;
};
