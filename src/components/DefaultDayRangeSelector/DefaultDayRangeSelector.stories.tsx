import { Meta } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { DefaultDayRangeSelector } from "./DefaultDayRangeSelector";

export default {
  title: "DefaultDayRangeSelector",
  component: DefaultDayRangeSelector,
  decorators: [withSetup],
} as Meta;

const Template = () => <DefaultDayRangeSelector />;
export const Default = Template.bind({});
