"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { logIn } from "./actions";
import { LoginError } from "../../types";

export const LoginForm = () => {
  const [visible, setVisible] = useState(false);

  const searchParams = useSearchParams();
  const unsafeRedirect = String(searchParams.get("redirect") ?? "/");
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required(
          t("loginPage.validation.username.required"),
        ),
        password: Yup.string().required(
          t("loginPage.validation.password.required"),
        ),
      })}
      onSubmit={async (values) => {
        setVisible(true);
        const result = await logIn(
          values.username,
          values.password,
          unsafeRedirect,
        );

        // Not sure why result is undefined when the login is successful. Result should be `never` in those cases
        // because we call `redirect` in `logIn`.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (result) {
          const message = {
            [LoginError.InvalidCredentials]: t("loginPage.invalidCredentials"),
            [LoginError.RateLimited]: t("rateLimitedError"),
            [LoginError.UnknownError]: t("unknownErrorOccurred"),
          }[result.error];
          showNotification({
            title: t("error"),
            color: "red",
            message: message,
          });
          setVisible(false);
        }
      }}
    >
      {() => (
        <Form style={{ width: "100%" }}>
          <FormikTextInput
            name="username"
            label={t("loginPage.username")}
            style={{ width: "100%" }}
          />
          <FormikPasswordInput
            name="password"
            label={t("loginPage.password")}
            mt={15}
            style={{ width: "100%" }}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {t("loginPage.loginButton")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
