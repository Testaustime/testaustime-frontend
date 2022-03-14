import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { MainPage } from "./components/pages/MainPage";
import { RegistrationPage } from "./components/pages/RegistrationPage";

export const AppSetup = () => {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  </div>;
};
