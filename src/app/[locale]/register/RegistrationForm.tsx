"use client";

import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { FormikTextInput } from "../../../components/forms/FormikTextInput";
import { FormikPasswordInput } from "../../../components/forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { register } from "./actions";
import { PostRequestError, RegistrationResult } from "../../../types";

export const RegistrationForm = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required(t("registrationPage.validation.username.required"))
          .min(2, t("registrationPage.validation.username.min", { min: 2 }))
          .max(32, t("registrationPage.validation.username.max", { max: 32 }))
          .matches(
            /^[a-zA-Z0-9]*$/,
            t("registrationPage.validation.username.regex"),
          ),
        password: Yup.string()
          .required(t("registrationPage.validation.password.required"))
          .min(8, t("registrationPage.validation.password.min", { min: 8 }))
          .max(
            128,
            t("registrationPage.validation.password.max", { max: 128 }),
          ),
        passwordConfirmation: Yup.string()
          .required(t("registrationPage.validation.passwordConfirm.required"))
          .oneOf(
            [Yup.ref("password")],
            t("registrationPage.validation.passwordConfirm.noMatch"),
          ),
      })}
      onSubmit={async (values) => {
        setVisible(true);
        const result = await register(values.username, values.password);
        switch (result) {
          case PostRequestError.RateLimited:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("registrationPage.rateLimited"),
            });
            setVisible(false);
            break;
          case PostRequestError.UnknownError:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
            });
            setVisible(false);
            break;
          case RegistrationResult.UsernameTaken:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("registrationPage.usernameTaken"),
            });
            setVisible(false);
            break;
        }
      }}
    >
      {() => (
        <Form>
          <FormikTextInput
            name="username"
            label={t("registrationPage.username")}
          />
          <FormikPasswordInput
            name="password"
            label={t("registrationPage.password")}
            mt={15}
          />
          <FormikPasswordInput
            name="passwordConfirmation"
            label={t("registrationPage.passwordConfirm")}
            mt={15}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {t("registrationPage.registerButton")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
