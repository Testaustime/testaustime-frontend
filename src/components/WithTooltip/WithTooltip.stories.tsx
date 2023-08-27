import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { WithTooltip, WithTooltipProps } from "./WithTooltip";

export default {
  title: "WithTooltip",
  component: WithTooltip,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn<WithTooltipProps> = (args) => <WithTooltip {...args} />;
export const Default = Template.bind({});
Default.args = {
  tooltipLabel: "This is a tooltip",
  children: "Hover me",
};
