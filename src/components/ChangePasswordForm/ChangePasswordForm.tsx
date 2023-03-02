import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useI18nContext } from "../../i18n/i18n-react";
import { PasswordChangeResult } from "../../hooks/useAuthentication";

export interface ChangePasswordFormProps {
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<PasswordChangeResult>
}

export const ChangePasswordForm = ({ onChangePassword }: ChangePasswordFormProps) => {
  const [visible, setVisible] = useState(false);
  const { LL } = useI18nContext();

  return <Formik
    initialValues={{
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: ""
    }}
    validationSchema={Yup.object().shape({
      oldPassword: Yup.string()
        .required(LL.profile.changePassword.old.required())
        .min(8, LL.profile.changePassword.old.tooShort({ min: 8 }))
        .max(128, LL.profile.changePassword.old.tooLong({ max: 128 })),
      newPassword: Yup.string()
        .required(LL.profile.changePassword.new.required())
        .min(8, LL.profile.changePassword.new.tooShort({ min: 8 }))
        .max(128, LL.profile.changePassword.new.tooLong({ max: 128 })),
      newPasswordConfirmation: Yup.string()
        .required(LL.profile.changePassword.confirm.required())
        .oneOf([Yup.ref("newPassword")], LL.profile.changePassword.confirm.noMatch())
    })}
    onSubmit={async (values, helpers) => {
      const result = await onChangePassword(values.oldPassword, values.newPassword);
      if (result === PasswordChangeResult.Success) {
        showNotification({
          title: LL.profile.changePassword.success.title(),
          color: "green",
          message: LL.profile.changePassword.success.message()
        });
        helpers.resetForm();
      }
      else {
        showNotification({
          title: LL.error(),
          color: "red",
          message: {
            [PasswordChangeResult.OldPasswordIncorrect]: LL.profile.changePassword.old.incorrect(),
            [PasswordChangeResult.NewPasswordInvalid]: LL.profile.changePassword.new.invalid()
          }[result]
        });
      }
      setVisible(false);
    }}>
    {() => <Form>
      <FormikPasswordInput name="oldPassword" label={LL.profile.changePassword.oldPassword()} />
      <FormikPasswordInput name="newPassword" label={LL.profile.changePassword.newPassword()} mt={15} />
      <FormikPasswordInput
        name="newPasswordConfirmation"
        label={LL.profile.changePassword.newPasswordConfirm()}
        mt={15}
      />
      <Button type="submit" mt={20}>
        <LoadingOverlay visible={visible} />
        {LL.profile.changePassword.submit()}
      </Button>
    </Form>}
  </Formik>;
};
