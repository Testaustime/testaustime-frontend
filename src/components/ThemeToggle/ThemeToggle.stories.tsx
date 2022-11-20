import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import ThemeToggle, { ThemeToggleProps } from "./ThemeToggle";

export default {
  title: "ThemeToggle",
  component: ThemeToggle,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn<ThemeToggleProps> = args => <ThemeToggle {...args} />;
export const Default = Template.bind({});
Default.args = {
  label: true
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: false
};
