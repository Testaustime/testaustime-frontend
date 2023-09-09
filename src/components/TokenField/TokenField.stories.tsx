import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import { TokenField, TokenFieldProps } from "./TokenField";

export default {
  title: "TokenField",
  component: TokenField,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn<TokenFieldProps> = (args) => <TokenField {...args} />;

export const DefaultCopyable = Template.bind({});
DefaultCopyable.args = {
  value: "LongTokenValue",
};

export const DefaultCensored = Template.bind({});
DefaultCensored.args = {
  value: "LongTokenThatShouldBeKeptSecret",
  censorable: true,
  revealLength: 8,
};

export const DefaultWithCopyFormatter = Template.bind({});
DefaultWithCopyFormatter.args = {
  value: "LongToken",
  copyFormatter: (value) => value.toLocaleUpperCase(),
};

export const DefaultWithTextFormatter = Template.bind({});
DefaultWithTextFormatter.args = {
  value: "LongToken",
  textFormatter: (value) => "prefix_" + value + "_suffix",
};
