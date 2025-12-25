"use client";

import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import styles from "./ChangeUsernameForm.module.css";
import { changeUsername } from "./actions";
import { ChangeUsernameError, PostRequestError } from "../../types";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../utils/authUtils";
import * as Yup from "yup";

export const ChangeUsernameForm = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        newUsername: "",
      }}
      validationSchema={Yup.object({
        newUsername: Yup.string()
          .required(t("profile.changeUsername.new.required"))
          .min(2, t("profile.changeUsername.new.tooShort", { min: 2 }))
          .max(32, t("profile.changeUsername.new.tooLong", { max: 32 }))
          .matches(/^[a-zA-Z0-9]*$/, t("profile.changeUsername.new.regex")),
      })}
      onSubmit={async (values, formik) => {
        const result = await changeUsername(values.newUsername);
        if (result && "error" in result) {
          switch (result.error) {
            case ChangeUsernameError.InvalidUsername:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("profile.changeUsername.new.invalid"),
              });
              break;
            case PostRequestError.RateLimited:
              router.push("/rate-limited");
              break;
            case PostRequestError.Unauthorized:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("errors.unauthorized"),
              });
              await logOutAndRedirect();
              break;
            case ChangeUsernameError.UsernameTaken:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("profile.changeUsername.usernameTaken"),
              });
              break;
            case PostRequestError.UnknownError:
              showNotification({
                title: t("error"),
                color: "red",
                message: t("unknownErrorOccurred"),
              });
              break;
          }
        } else {
          showNotification({
            title: t("profile.changeUsername.success.title"),
            color: "green",
            message: t("profile.changeUsername.success.message"),
          });
          formik.resetForm();
          router.refresh();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <FormikTextInput
            name="newUsername"
            label={t("profile.changeUsername.newUsernameLabel")}
            className={styles.input}
          />
          <Button type="submit" loading={isSubmitting}>
            {t("profile.changeUsername.submit")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
