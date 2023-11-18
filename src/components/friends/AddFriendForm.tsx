"use client";

import { Button, Group } from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AddFriendError } from "../../types";
import { addFriend } from "./actions";

type AddFriendFormProps = {
  friendCodePlaceholder: string;
};

export const AddFriendForm = ({
  friendCodePlaceholder,
}: AddFriendFormProps) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const urlFriendCode = params.get("code");

  return (
    <Group>
      <Formik
        initialValues={{ friendCode: urlFriendCode ?? "" }}
        validationSchema={Yup.object().shape({
          friendCode: Yup.string()
            .required(t("friends.friendCodeRequired"))
            .matches(/^ttfc_[a-zA-Z0-9]{24}$/, t("friends.friendCodeInvalid")),
        })}
        onSubmit={async ({ friendCode }, { resetForm }) => {
          const result = await addFriend(friendCode);
          if (typeof result === "object") {
            resetForm();
          } else {
            showNotification({
              title: t("error"),
              message: {
                [AddFriendError.AlreadyFriends]: t(
                  "friends.error.alreadyFriends",
                ),
                [AddFriendError.NotFound]: t("friends.error.notFound"),
                [AddFriendError.UnknownError]: t("unknownErrorOccurred"),
              }[result],
              color: "red",
            });
          }
        }}
      >
        {() => (
          <Form style={{ width: "100%" }}>
            <Group align="start">
              <FormikTextInput
                leftSection={<PersonIcon />}
                name="friendCode"
                label={t("friends.friendCode")}
                placeholder={friendCodePlaceholder}
                style={{ flex: 1 }}
              />
              <Button type="submit" mt={27.5}>
                {t("friends.add")}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Group>
  );
};
