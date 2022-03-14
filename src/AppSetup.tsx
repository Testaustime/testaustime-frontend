import { Provider } from "react-redux";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import { LoginPage } from "./components/pages/LoginPage";
import { MainPage } from "./components/pages/MainPage";
import { RegistrationPage } from "./components/pages/RegistrationPage";
import { store } from "./store";

const Layout = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
`;

export const AppSetup = () => {
  return <Layout>
    <Container>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Container>
  </Layout>;
};
