"use client";

import { Button, Group } from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { showNotification } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "../../axios";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

type AddFriendFormProps = {
  friendCodePlaceholder: string;
};

type ApiFriendsAddResponse = {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
};

enum AddFriendError {
  AlreadyFriends,
  NotFound,
  UnknownError,
}

export const AddFriendForm = ({
  friendCodePlaceholder,
}: AddFriendFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const urlFriendCode = params.get("code");

  const addFriend = async (friendCode: string) => {
    try {
      const response = await axios.post<ApiFriendsAddResponse>(
        "/friends/add",
        friendCode,
        {
          headers: { "Content-Type": "text/plain" },
        },
      );

      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        if (
          e.response?.status === 409 ||
          // TODO: The 403 status is a bug with the backend.
          // It can be removed when https://github.com/Testaustime/testaustime-backend/pull/61 is merged
          e.response?.status === 403
        ) {
          return AddFriendError.AlreadyFriends;
        } else if (e.response?.status === 404) {
          return AddFriendError.NotFound;
        }
      }
      return AddFriendError.UnknownError;
    }
  };

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
            router.refresh();
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
