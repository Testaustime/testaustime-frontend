import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppSetup } from "./AppSetup";
import { App } from "./components/App";
import "./index.css";
import { store } from "./store";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");

const root = createRoot(container);
root.render(<React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AppSetup>
        <App />
      </AppSetup>
    </BrowserRouter>
  </Provider>
</React.StrictMode>);
