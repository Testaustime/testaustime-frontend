import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppSetup } from "./AppSetup";
import "./index.css";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppSetup />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
