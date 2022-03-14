import { Anchor, Button, Group, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import styled from "styled-components";
import { LoginPage } from "./components/pages/LoginPage";
import { MainPage } from "./components/pages/MainPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { RegistrationPage } from "./components/pages/RegistrationPage";
import { useAuthentication } from "./hooks/useAuthentication";
import { RootState } from "./store";

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
  const username = useSelector<RootState, string>(state => state.users.username);
  const { logOut, isLoggedIn } = useAuthentication();

  return <MantineProvider theme={{
    fontFamily: "'Ubuntu', sans-serif"
  }}>
    <NotificationsProvider>
      <Layout>
        <Container>
          <BrowserRouter>
            <Group position="apart" mb={50}>
              <TestaustimeTitle to="/">
                Testaustime
              </TestaustimeTitle>
              <Group spacing={15} align="center">
                {!isLoggedIn && <Anchor component={Link} to="/login">Login</Anchor>}
                {!isLoggedIn && <Button component={Link} to="/register">Register</Button>}
                {isLoggedIn && <Anchor component={Link} to="/profile">My profile</Anchor>}
                {isLoggedIn && <Button variant="outline" size="sm" onClick={logOut}>Log out: {username}</Button>}
              </Group>
            </Group>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </Layout>
    </NotificationsProvider>
  </MantineProvider>;
};
