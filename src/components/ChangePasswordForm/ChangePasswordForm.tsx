"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import axios from "../../axios";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../../lib/errorHandling/errorHandler";
import { useTranslation } from "react-i18next";

export enum PasswordChangeResult {
  Success,
  OldPasswordIncorrect,
  NewPasswordInvalid,
}

export const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await axios.post("/auth/changepassword", {
        old: oldPassword,
        new: newPassword,
      });
      return PasswordChangeResult.Success;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          return PasswordChangeResult.OldPasswordIncorrect;
        } else if (error.response?.status === 400) {
          return PasswordChangeResult.NewPasswordInvalid;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw getErrorMessage(error);
    }
  };

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      }}
      validationSchema={Yup.object().shape({
        oldPassword: Yup.string()
          .required(t("profile.changePassword.old.required"))
          .min(8, t("profile.changePassword.old.tooShort", { min: 8 }))
          .max(128, t("profile.changePassword.old.tooLong", { max: 128 })),
        newPassword: Yup.string()
          .required(t("profile.changePassword.new.required"))
          .min(8, t("profile.changePassword.new.tooShort", { min: 8 }))
          .max(128, t("profile.changePassword.new.tooLong", { max: 128 })),
        newPasswordConfirmation: Yup.string()
          .required(t("profile.changePassword.confirm.required"))
          .oneOf(
            [Yup.ref("newPassword")],
            t("profile.changePassword.confirm.noMatch"),
          ),
      })}
      onSubmit={async (values, helpers) => {
        const result = await changePassword(
          values.oldPassword,
          values.newPassword,
        );
        if (result === PasswordChangeResult.Success) {
          showNotification({
            title: t("profile.changePassword.success.title"),
            color: "green",
            message: t("profile.changePassword.success.message"),
          });
          helpers.resetForm();
        } else {
          showNotification({
            title: t("error"),
            color: "red",
            message: {
              [PasswordChangeResult.OldPasswordIncorrect]: t(
                "profile.changePassword.old.incorrect",
              ),
              [PasswordChangeResult.NewPasswordInvalid]: t(
                "profile.changePassword.new.invalid",
              ),
            }[result],
          });
        }
        setVisible(false);
      }}
    >
      {() => (
        <Form>
          <FormikPasswordInput
            name="oldPassword"
            label={t("profile.changePassword.oldPassword")}
          />
          <FormikPasswordInput
            name="newPassword"
            label={t("profile.changePassword.newPassword")}
            mt={15}
          />
          <FormikPasswordInput
            name="newPasswordConfirmation"
            label={t("profile.changePassword.newPasswordConfirm")}
            mt={15}
          />
          <Button type="submit" mt={20}>
            <LoadingOverlay visible={visible} />
            {t("profile.changePassword.submit")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
