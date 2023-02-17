import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { LanguageSelector, LanguageSelectorProps } from "./LanguageSelector";

export default {
  title: "LanguageSelector",
  component: LanguageSelector,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn<LanguageSelectorProps> = args => <LanguageSelector {...args} />;
export const Default = Template.bind({});

Default.args = {
  type: "segmented",
  showLabel: true
};

export const Dropdown = Template.bind({});
Dropdown.args = {
  type: "dropdown",
  showLabel: true
};
