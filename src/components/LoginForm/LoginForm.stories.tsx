import { Meta, StoryFn } from "@storybook/react";
import { LoginForm, LoginFormProps } from "./LoginForm";
import { withSetup } from "../../../.storybook/withSetup";

export default {
  title: "LoginForm",
  component: LoginForm,
  decorators: [withSetup]
} as Meta;

const Template: StoryFn<LoginFormProps> = args => <LoginForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onLogin: async (username: string, password: string) => {
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    alert(`Username: ${username}, password: ${password}`);
    return Promise.resolve();
  }
};
