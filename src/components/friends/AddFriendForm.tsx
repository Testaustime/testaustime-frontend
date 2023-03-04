import { Button, Group } from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import { useState } from "react";
import { generateFriendCode } from "../../utils/codeUtils";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { AddFriendError, useFriends } from "../../hooks/useFriends";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";

export const AddFriendForm = () => {
  const [placeholderFriendCode] = useState(generateFriendCode());
  const { addFriend } = useFriends();
  const location = useLocation();
  const urlFriendCode = new URLSearchParams(location.search).get("code");
  const { t } = useTranslation();

  return <Group>
    <Formik
      initialValues={{ friendCode: urlFriendCode ?? "" }}
      validationSchema={Yup.object().shape({
        friendCode: Yup
          .string()
          .required(t("friends.friendCodeRequired"))
          .matches(/^ttfc_[a-zA-Z0-9]{24}$/, t("friends.friendCodeInvalid"))
      })}
      onSubmit={async ({ friendCode }, { resetForm }) => {
        const result = await addFriend(friendCode);
        if (typeof result === "object") {
          resetForm();
        }
        else {
          showNotification({
            title: t("error"),
            message: {
              [AddFriendError.AlreadyFriends]: t("friends.error.alreadyFriends"),
              [AddFriendError.NotFound]: t("friends.error.notFound"),
              [AddFriendError.UnknownError]: t("friends.error.unknownError")
            }[result],
            color: "red"
          });
        }
      }}>
      {() => <Form style={{ width: "100%" }}>
        <Group align="start">
          <FormikTextInput
            icon={<PersonIcon />}
            name="friendCode"
            label={t("friends.friendCode")}
            placeholder={placeholderFriendCode}
            sx={{ flex: 1 }}
            styles={{
              input: {
                "&[data-invalid]::placeholder": {
                  opacity: 0.5
                }
              }
            }}
          />
          <Button type="submit" mt={27.5}>{t("friends.add")}</Button>
        </Group>
      </Form>}
    </Formik>
  </Group>;
};
