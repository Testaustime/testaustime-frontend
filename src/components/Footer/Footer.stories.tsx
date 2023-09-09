import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { Footer } from "./Footer";

export default {
  title: "Footer",
  component: Footer,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn = () => <Footer />;
export const Default = Template.bind({});
