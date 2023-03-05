import type { Decorator } from "@storybook/react";
import { AppSetup } from "../src/AppSetup";

export const withSetup: Decorator = (Story) => {
  return <AppSetup>
    <Story />
  </AppSetup>
};
