import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { SmoothChartsSelector } from "./SmoothChartsSelector";

export default {
  title: "SmoothChartsSelector",
  component: SmoothChartsSelector,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn = () => <SmoothChartsSelector />;
export const Default = Template.bind({});
