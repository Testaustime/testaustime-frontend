import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import {
  DailyCodingTimeChart,
  DailyCodingTimeChartProps,
} from "./DailyCodingTimeChart";
import { addDays } from "date-fns";

export default {
  title: "DailyCodingTimeChart",
  component: DailyCodingTimeChart,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn<DailyCodingTimeChartProps> = (args) => (
  <DailyCodingTimeChart {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: [
    { date: addDays(new Date(), -6), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -5), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -4), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -3), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -2), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -1), duration: Math.random() * 15000 },
    { date: addDays(new Date(), -0), duration: Math.random() * 15000 },
  ],
};

export const NoTimeCoded = Template.bind({});
NoTimeCoded.args = {
  data: [
    { date: addDays(new Date(), -6), duration: 0 },
    { date: addDays(new Date(), -5), duration: 0 },
    { date: addDays(new Date(), -4), duration: 0 },
    { date: addDays(new Date(), -3), duration: 0 },
    { date: addDays(new Date(), -2), duration: 0 },
    { date: addDays(new Date(), -1), duration: 0 },
    { date: addDays(new Date(), -0), duration: 0 },
  ],
};
