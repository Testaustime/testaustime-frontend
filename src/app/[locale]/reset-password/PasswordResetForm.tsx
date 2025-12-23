"use client";

import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { FormikPasswordInput } from "../../../components/forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { PasswordResetResult } from "../../../types";
import { resetPassword } from "./actions";
import { redirect, useSearchParams } from "next/navigation";

export const PasswordResetForm = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const token = useSearchParams().get("token");

  if (token == null) {
    // FIXME: Dumb
    return redirect("/");
  }

  return (
    <Formik
      initialValues={{
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .required(t("passwordResetPage.validation.password.required"))
          .min(8, t("passwordResetPage.validation.password.min", { min: 8 }))
          .max(
            128,
            t("passwordResetPage.validation.password.max", { max: 128 }),
          ),
        passwordConfirmation: Yup.string()
          .required(t("passwordResetPage.validation.passwordConfirm.required"))
          .oneOf(
            [Yup.ref("password")],
            t("passwordResetPage.validation.passwordConfirm.noMatch"),
          ),
      })}
      onSubmit={async (values) => {
        setVisible(true);

        const result = await resetPassword(token, values.password);

        switch (result) {
          case PasswordResetResult.RateLimited:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("passwordResetPage.rateLimited"),
            });
            setVisible(false);
            break;
          case PasswordResetResult.UnknownError:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
            });
            setVisible(false);
            break;
          case PasswordResetResult.InvalidToken:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("passwordResetPage.invalidToken"),
            });
            setVisible(false);
            break;
          case PasswordResetResult.Success:
            showNotification({
              title: t("passwordResetPage.title"),
              color: "green",
              message: t("passwordResetPage.success"),
            });
            redirect("/login");
        }
      }}
    >
      {() => (
        <Form style={{ width: "100%" }}>
          <FormikPasswordInput
            name="password"
            label={t("registrationPage.password")}
            style={{ width: "100%" }}
          />
          <FormikPasswordInput
            name="passwordConfirmation"
            label={t("registrationPage.passwordConfirm")}
            mt={15}
            style={{ width: "100%" }}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {t("passwordResetPage.changePassword")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
