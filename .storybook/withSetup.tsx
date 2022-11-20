import type { Decorator } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppSetup } from "../src/AppSetup";
import { store } from "../src/store";

export const withSetup: Decorator = (Story) => {
  return <Provider store={store}>
    <BrowserRouter>
      <AppSetup>
        <Story />
      </AppSetup>
    </BrowserRouter>
  </Provider>
};
