"use client";

import { Button, Group } from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AddFriendError } from "../../types";
import { addFriend } from "./actions";
import { useState } from "react";

type AddFriendFormProps = {
  friendCodePlaceholder: string;
};

export const AddFriendForm = ({
  friendCodePlaceholder,
}: AddFriendFormProps) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const urlFriendCode = params.get("code");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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
          setIsLoading(true);
          const result = await addFriend(friendCode);
          setIsLoading(false);
          if ("error" in result) {
            showNotification({
              title: t("error"),
              message: {
                [AddFriendError.AlreadyFriends]: t(
                  "friends.error.alreadyFriends",
                ),
                [AddFriendError.NotFound]: t("friends.error.notFound"),
                [AddFriendError.UnknownError]: t("unknownErrorOccurred"),
              }[result.error],
              color: "red",
            });
          } else {
            resetForm();
            router.refresh();
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
              <Button type="submit" mt={27.5} loading={isLoading}>
                {t("friends.add")}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Group>
  );
};
