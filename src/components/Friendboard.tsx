import { Button, Title, Table, Group, useMantineTheme, Text } from "@mantine/core";
import { useFriends } from "../hooks/useFriends";
import { PersonIcon } from "@radix-ui/react-icons";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "./forms/FormikTextInput";
import { generateFriendCode } from "../utils/codeUtils";
import { useState } from "react";
import { handleErrorWithNotification } from "../utils/notificationErrorHandler";
import { prettyDuration } from "../utils/dateUtils";
import { sumBy } from "../utils/arrayUtils";
import { useActivityData } from "../hooks/useActivityData";
import { addDays, startOfDay } from "date-fns/esm";
import useAuthentication from "../hooks/UseAuthentication";
import { useLocation } from "react-router";
import { useI18nContext } from "../i18n/i18n-react";

export const Friendboard = () => {
  const { addFriend, unFriend, friends } = useFriends();
  const entries = useActivityData();
  const { username } = useAuthentication();
  const location = useLocation();
  const urlFriendCode = new URLSearchParams(location.search).get("code");

  // We have to use useState, so it stays the same when the component is re-rendered
  const [placeholderFriendCode] = useState(generateFriendCode());

  const theme = useMantineTheme();

  const { LL } = useI18nContext();

  if (!username) {
    return <Text>{LL.friends.notLoggedIn()}</Text>;
  }

  const entriesInRange = entries.filter(entry => {
    const startOfStatisticsRange = startOfDay(addDays(new Date(), -30));
    return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
  });

  const friendsSorted = [...friends.map(f => ({ ...f, isMe: false })).concat({
    coding_time: {
      all_time: 0,
      past_month: sumBy(entriesInRange, entry => entry.duration),
      past_week: 0
    },
    isMe: true,
    username
  })].sort((a, b) => b.coding_time.past_month - a.coding_time.past_month);

  return <div>
    <Title order={2} mb={15}>{LL.friends.addNewFriend()}</Title>
    <Group>
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
    </Group>
    <Title order={2} mt={40}>{LL.friends.yourFriends()}</Title>
    <Table>
      <thead>
        <tr>
          <th>{LL.friends.index()}</th>
          <th>{LL.friends.friendName()}</th>
          <th>{LL.friends.timeCoded({ days: 30 })}</th>
          <th />
        </tr>
      </thead>
      <tbody>{friendsSorted.map(({ username, coding_time: { past_month }, isMe }, idx) => (
        <tr key={username} style={{
          backgroundColor: isMe ? (theme.colorScheme === "dark" ? "#2b2b2b" : "#dedede") : undefined
        }}>
          <td>{idx + 1}</td>
          <td>{username}</td>
          <td>{prettyDuration(past_month)}</td>
          <td style={{ textAlign: "right" }}>
            {!isMe && <Button
              variant="outline"
              color="red"
              compact
              onClick={() => {
                unFriend(username).catch(handleErrorWithNotification);
              }}
            >
              {LL.friends.unfriend()}
            </Button>}
          </td>
        </tr>
      ))}</tbody>
    </Table>
  </div>;
};
