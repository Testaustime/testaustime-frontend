"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import axios from "../../../axios";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../../../lib/errorHandling/errorHandler";
import { showNotification } from "@mantine/notifications";
import { FormikTextInput } from "../../../components/forms/FormikTextInput";
import { FormikPasswordInput } from "../../../components/forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";

export enum RegistrationResult {
  Success,
  RateLimited,
}

export interface ApiAuthRegisterResponse {
  auth_token: string;
  username: string;
  friend_code: string;
  registration_time: string;
}

export const RegistrationForm = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const register = async (username: string, password: string) => {
    try {
      await axios.post<ApiAuthRegisterResponse>("/auth/register", {
        username,
        password,
      });
      router.refresh();
      return RegistrationResult.Success;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 429) {
          return RegistrationResult.RateLimited;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw getErrorMessage(error);
    }
  };

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
      onSubmit={(values) => {
        setVisible(true);
        register(values.username, values.password)
          .then((result) => {
            switch (result) {
              case RegistrationResult.Success:
                router.push("/");
                break;
              case RegistrationResult.RateLimited:
                showNotification({
                  title: t("error"),
                  color: "red",
                  message: t("registrationPage.rateLimited"),
                });
                setVisible(false);
                break;
            }
          })
          .catch(() => {
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
              autoClose: false,
            });
            setVisible(false);
          });
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
