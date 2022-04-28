import { Button, Title, Table, Group } from "@mantine/core";
import { useFriends } from "../hooks/useFriends";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "./forms/FormikTextInput";
import { generateFriendCode } from "../utils/friendUtils";
import { useState } from "react";
import { handleErrorWithNotification } from "../utils/notificationErrorHandler";

export const Friendboard = () => {
  const { addFriend, unFriend, friends } = useFriends();

  // We have to use useState, so it stays the same when the component is re-rendered
  const [placeholderFriendCode] = useState(generateFriendCode());

  return <div>
    <Title order={2} mb={15}>Add a new friend</Title>
    <Group>
      <Formik
        initialValues={{ friendCode: "" }}
        validationSchema={Yup.object().shape({
          friendCode: Yup
            .string()
            .required("Friend code is required")
            .matches(/^ttfc_[a-zA-Z0-9]{24}$/, "Friend code must start with \"ttfc_\", and be followed by 24 alphanumeric characters.")
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
              label="Friend code"
              placeholder={placeholderFriendCode}
              sx={{ flex: 1 }}
              styles={theme => ({
                invalid: {
                  "::placeholder": {
                    color: theme.fn.rgba(theme.colors.red[5], 0.4),
                  }
                }
              })}
            />
            <Button type="submit" mt={27.5}>Add</Button>
          </Group>
        </Form>}
      </Formik>
    </Group>
    <Title order={2} mt={40}>Your friends</Title>
    <Table>
      <thead>
        <tr>
          <th>Index</th>
          <th>Friend name</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>{friends.map((username, idx) => (
        <tr key={username}>
          <td>{idx + 1}</td>
          <td>{username}</td>
          <td>
            <Group position="right">
              <Button
                variant="outline"
                color="red"
                compact
                onClick={() => unFriend(username).catch(handleErrorWithNotification)}
              >
                Unfriend
              </Button>
            </Group>
          </td>
        </tr>
      ))}</tbody>
    </Table>
  </div>;
};
