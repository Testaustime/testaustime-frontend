"use client";

import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { requestPasswordReset } from "./actions";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { PasswordResetRequestResult } from "../../../types";
import { FormikTextInput } from "../../../components/forms/FormikTextInput";

export const PasswordResetRequestForm = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(t("passwordResetRequestPage.validation.email.invalid"))
          .required(),
      })}
      onSubmit={async (values) => {
        const result = await requestPasswordReset(values.email);
        switch (result) {
          case PasswordResetRequestResult.RateLimited:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("passwordResetRequestPage.rateLimited"),
            });
            setVisible(false);
            break;
          case PasswordResetRequestResult.UnknownError:
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred"),
            });
            setVisible(false);
            break;
          case PasswordResetRequestResult.Success:
            showNotification({
              title: t("passwordResetRequestPage.success"),
              color: "green",
              message: t("passwordResetRequestPage.emailSent"),
            });
            setVisible(false);
            break;
        }
      }}
    >
      {() => (
        <Form style={{ width: "100%" }}>
          <FormikTextInput
            name="email"
            label={t("passwordResetRequestPage.email")}
            style={{ width: "100%" }}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {t("passwordResetRequestPage.sendEmailButton")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
