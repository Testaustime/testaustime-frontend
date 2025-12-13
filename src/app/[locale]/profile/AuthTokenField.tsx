"use client";

import { showNotification } from "@mantine/notifications";
import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";
import { useTranslation } from "react-i18next";
import { PostRequestError } from "../../../types";
import { Button, LoadingOverlay, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FormikPasswordInput } from "../../../components/forms/FormikPasswordInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";

export const AuthTokenField = ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const { t } = useTranslation();
  const modals = useModals();

  const openPasswordModal = () => {
    const id = modals.openModal({
      title: t("profile.authenticationToken.confirmPassword"),
      size: "xl",
      children: (
        <div>
          <Text>
            {t("profile.authenticationToken.passwordRequiredDescription")}
          </Text>
          <Formik
            initialValues={{
              password: "",
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required(
                t("profile.authenticationToken.passwordRequired"),
              ),
            })}
            onSubmit={async (values) => {
              const result = await regenerateToken(username, values.password);
              if (result && "error" in result) {
                showNotification({
                  title: t("error"),
                  message: {
                    [PostRequestError.RateLimited]: t("rateLimitedError"),
                    [PostRequestError.Unauthorized]: t(
                      "profile.authenticationToken.regenerateWrongPassword",
                    ),
                    [PostRequestError.UnknownError]: t("unknownErrorOccurred"),
                  }[result.error],
                  color: "red",
                });
              } else {
                showNotification({
                  title: t(
                    "profile.authenticationToken.regenerateSuccessTitle",
                  ),
                  message: t(
                    "profile.authenticationToken.regenerateSuccessDescription",
                  ),
                  color: "green",
                  autoClose: 15000,
                });
                modals.closeModal(id);
              }
            }}
          >
            {(formik) => (
              <Form>
                <FormikPasswordInput
                  name="password"
                  label={t("profile.authenticationToken.passwordLabel")}
                  mt={15}
                />
                <Button mt={20} type="submit">
                  <LoadingOverlay visible={formik.isSubmitting} />
                  {t("profile.authenticationToken.confirmPassword")}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      ),
      styles: {
        title: {
          fontSize: "2rem",
          marginBlock: "0.5rem",
          fontWeight: "bold",
        },
      },
    });
  };

  return (
    <>
      <TokenField
        value={token}
        // eslint-disable-next-line @typescript-eslint/require-await
        regenerate={async () => {
          openPasswordModal();
        }}
        censorable
        revealLength={4}
      />
    </>
  );
};
