import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { Censorable, CensorableProps } from "./Censorable";

export default {
  title: "Censorable",
  component: Censorable,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn<CensorableProps> = args => <Censorable {...args} />;

export const Default = Template.bind({});
Default.args = {
  authToken: "SecretToken1234",
  hiddenCharacter: "*",
  revealLength: 7,
  revealed: false
};
