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

export type AddFriendFormProps = {
  friendCodePlaceholder: string;
  texts: {
    friendCodeRequired: string;
    friendCodeInvalid: string;
    error: string;
    alreadyFriends: string;
    notFound: string;
    unknownError: string;
    friendCode: string;
    add: string;
  };
};

export interface ApiFriendsAddResponse {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
}

export enum AddFriendError {
  AlreadyFriends,
  NotFound,
  UnknownError,
}

export const AddFriendForm = ({
  friendCodePlaceholder,
  texts,
}: AddFriendFormProps) => {
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
            .required(texts.friendCodeRequired)
            .matches(/^ttfc_[a-zA-Z0-9]{24}$/, texts.friendCodeRequired),
        })}
        onSubmit={async ({ friendCode }, { resetForm }) => {
          const result = await addFriend(friendCode);
          if (typeof result === "object") {
            resetForm();
            router.refresh();
          } else {
            showNotification({
              title: texts.error,
              message: {
                [AddFriendError.AlreadyFriends]: texts.alreadyFriends,
                [AddFriendError.NotFound]: texts.notFound,
                [AddFriendError.UnknownError]: texts.unknownError,
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
                label={texts.friendCode}
                placeholder={friendCodePlaceholder}
                style={{ flex: 1 }}
              />
              <Button type="submit" mt={27.5}>
                {texts.add}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Group>
  );
};
