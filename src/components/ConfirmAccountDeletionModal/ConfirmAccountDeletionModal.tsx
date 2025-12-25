"use client";

import { Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useState } from "react";
import { Form, Formik } from "formik";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { deleteAccount } from "../../app/[locale]/profile/deleteAccount";
import { showNotification } from "@mantine/notifications";
import { PostRequestError } from "../../types";

type ConfirmAccountDeletionModalProps = {
  username: string;
  closeModal: () => void;
};

export const ConfirmAccountDeletionModal = ({
  username,
  closeModal,
}: ConfirmAccountDeletionModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Text>{t("profile.deleteAccount.modalDescription")}</Text>
      <Formik
        initialValues={{
          password: "",
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().required(
            t("profile.sudoOperation.passwordRequired"),
          ),
        })}
        onSubmit={async (values) => {
          setLoading(true);
          const result = await deleteAccount(username, values.password);
          setLoading(false);
          if (result && "error" in result) {
            showNotification({
              title: t("error"),
              message: {
                [PostRequestError.RateLimited]: t("rateLimitedError"),
                [PostRequestError.Unauthorized]: t(
                  "profile.sudoOperation.wrongPassword",
                ),
                [PostRequestError.UnknownError]: t("unknownErrorOccurred"),
              }[result.error],
              color: "red",
            });
          } else {
            showNotification({
              title: t("profile.deleteAccount.notification.successTitle"),
              message: t(
                "profile.deleteAccount.notification.successDescription",
              ),
              color: "green",
            });
            closeModal();
          }
        }}
      >
        {() => (
          <Form
            style={{
              width: "100%",
              display: "flex",
              gap: "2rem",
              flexDirection: "column",
            }}
          >
            <FormikPasswordInput
              name="password"
              label={t("profile.sudoOperation.passwordLabel")}
              mt={15}
              style={{ width: "100%" }}
            />
            <Group justify="right">
              <Button
                variant="outline"
                onClick={() => {
                  closeModal();
                }}
              >
                {t("prompt.cancel")}
              </Button>
              <Button color="red" type="submit">
                <LoadingOverlay visible={loading} />
                {t("profile.sudoOperation.confirmButton")}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </div>
  );
};
