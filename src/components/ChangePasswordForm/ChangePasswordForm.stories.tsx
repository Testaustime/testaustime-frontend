import { Meta, StoryFn } from "@storybook/react";
import { withSetup } from "../../../.storybook/withSetup";
import {
  ChangePasswordForm,
  ChangePasswordFormProps,
} from "./ChangePasswordForm";
import { PasswordChangeResult } from "../../hooks/useAuthentication";

export default {
  title: "ChangePasswordForm",
  component: ChangePasswordForm,
  decorators: [withSetup],
} as Meta;

const Template: StoryFn<ChangePasswordFormProps> = (args) => (
  <ChangePasswordForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onChangePassword: (oldPassword: string, newPassword: string) => {
    alert(`Old password: ${oldPassword}, new password: ${newPassword}`);
    return Promise.resolve(PasswordChangeResult.Success);
  },
};
