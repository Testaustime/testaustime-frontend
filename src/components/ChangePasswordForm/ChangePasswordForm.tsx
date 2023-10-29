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

export enum PasswordChangeResult {
  Success,
  OldPasswordIncorrect,
  NewPasswordInvalid,
}

export type ChangePasswordFormProps = {
  texts: {
    submit: string;
    oldPassword: {
      title: string;
      required: string;
      tooShort: string;
      tooLong: string;
    };
    newPassword: {
      title: string;
      required: string;
      tooShort: string;
      tooLong: string;
    };
    newPasswordConfirm: {
      title: string;
      required: string;
      noMatch: string;
    };
    success: {
      title: string;
      message: string;
    };
    oldIncorrect: string;
    newInvalid: string;
    error: string;
  };
};

export const ChangePasswordForm = ({ texts }: ChangePasswordFormProps) => {
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
          .required(texts.oldPassword.required)
          .min(8, texts.oldPassword.tooShort)
          .max(128, texts.oldPassword.tooLong),
        newPassword: Yup.string()
          .required(texts.newPassword.required)
          .min(8, texts.newPassword.tooShort)
          .max(128, texts.newPassword.tooLong),
        newPasswordConfirmation: Yup.string()
          .required(texts.newPasswordConfirm.required)
          .oneOf([Yup.ref("newPassword")], texts.newPasswordConfirm.noMatch),
      })}
      onSubmit={async (values, helpers) => {
        const result = await changePassword(
          values.oldPassword,
          values.newPassword,
        );
        if (result === PasswordChangeResult.Success) {
          showNotification({
            title: texts.success.title,
            color: "green",
            message: texts.success.message,
          });
          helpers.resetForm();
        } else {
          showNotification({
            title: texts.error,
            color: "red",
            message: {
              [PasswordChangeResult.OldPasswordIncorrect]: texts.oldIncorrect,
              [PasswordChangeResult.NewPasswordInvalid]: texts.newInvalid,
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
            label={texts.oldPassword.title}
          />
          <FormikPasswordInput
            name="newPassword"
            label={texts.newPassword.title}
            mt={15}
          />
          <FormikPasswordInput
            name="newPasswordConfirmation"
            label={texts.newPasswordConfirm.title}
            mt={15}
          />
          <Button type="submit" mt={20}>
            <LoadingOverlay visible={visible} />
            {texts.submit}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
