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

const HeaderRow = styled.header`
  display: flex;
  padding-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;

const HeaderLinks = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;


export const AppSetup = () => {
  const username = useSelector<RootState, string>(state => state.users.username);
  const { logOut, isLoggedIn } = useAuthentication();

  return <Layout>
    <Container>
      <BrowserRouter>
        <HeaderRow>
          <TestaustimeTitle to="/">
            Testaustime
          </TestaustimeTitle>
          <HeaderLinks>
            {!isLoggedIn && <Link to="/login">Login</Link>}
            {!isLoggedIn && <Link to="/register">Register</Link>}
            {isLoggedIn && <Link to="/profile">My profile</Link>}
            {isLoggedIn && <button onClick={logOut}>Log out: {username}</button>}
          </HeaderLinks>
        </HeaderRow>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  </Layout>;
};
