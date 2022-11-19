import { Button, Group } from "@mantine/core";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import { useState } from "react";
import { generateFriendCode } from "../../utils/codeUtils";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { useFriends } from "../../hooks/useFriends";
import { useLocation } from "react-router";
import { useI18nContext } from "../../i18n/i18n-react";
import { handleErrorWithNotification } from "../../utils/notificationErrorHandler";

export const AddFriendForm = () => {
  const [placeholderFriendCode] = useState(generateFriendCode());
  const { addFriend } = useFriends();
  const location = useLocation();
  const urlFriendCode = new URLSearchParams(location.search).get("code");
  const { LL } = useI18nContext();

  return <Group>
    <Formik
      initialValues={{ friendCode: urlFriendCode ?? "" }}
      validationSchema={Yup.object().shape({
        friendCode: Yup
          .string()
          .required(LL.friends.friendCodeRequired())
          .matches(/^ttfc_[a-zA-Z0-9]{24}$/, LL.friends.friendCodeInvalid())
      })}
      onSubmit={({ friendCode }, { resetForm }) => {
        addFriend(friendCode)
          .then(() => resetForm())
          .catch(handleErrorWithNotification);
      }}>
      {() => <Form style={{ width: "100%" }}>
        <Group align="start">
          <FormikTextInput
            icon={<PersonIcon />}
            name="friendCode"
            label={LL.friends.friendCode()}
            placeholder={placeholderFriendCode}
            sx={{ flex: 1 }}
            styles={theme => ({
              invalid: {
                "::placeholder": {
                  color: theme.fn.rgba(theme.colors.red[5], 0.4)
                }
              }
            })}
          />
          <Button type="submit" mt={27.5}>{LL.friends.add()}</Button>
        </Group>
      </Form>}
    </Formik>
  </Group>;
};