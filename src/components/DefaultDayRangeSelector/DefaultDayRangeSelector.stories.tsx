import { Meta } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { DefaultDayRangeSelector } from "./DefaultDayRangeSelector";

export default {
  title: "DefaultDayRangeSelector",
  component: DefaultDayRangeSelector,
  decorators: [withSetup],
} as Meta;

const Template = () => (
  <DefaultDayRangeSelector
    texts={{
      label: "Default day range",
      options: {
        week: "Week",
        month: "Month",
        all: "All",
      },
    }}
  />
);
export const Default = Template.bind({});
