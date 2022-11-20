import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { LanguageSelector } from "./LanguageSelector";

export default {
  title: "LanguageSelector",
  component: LanguageSelector,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn = () => <LanguageSelector />;
export const Default = Template.bind({});
