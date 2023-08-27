import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import {
  ButtonWithConfirmation,
  ButtonWithConfirmationProps,
} from "./ButtonWithConfirmation";

export default {
  title: "ButtonWithConfirmation",
  component: ButtonWithConfirmation,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn<ButtonWithConfirmationProps> = (args) => (
  <ButtonWithConfirmation {...args} />
);
export const Default = Template.bind({});

Default.args = {
  children: "Click me",
  onClick: () => {
    alert("Clicked!");
  },
};
