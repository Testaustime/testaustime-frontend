import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button, Text } from "@mantine/core";
import axios from "axios";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";

interface JoinLeaderboardModalProps {
  initialCode: string | null,
  onJoin: (leaderboardCode: string) => Promise<void>
}

export const JoinLeaderboardModal = ({ initialCode, onJoin }: JoinLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");
  const [placeholderLeaderboardInviteCode] = useState(generateLeaderboardInviteCode());

  return <>
    <Formik
      initialValues={{
        leaderboardCode: initialCode ?? ""
      }}
      validationSchema={Yup.object().shape({
        leaderboardCode: Yup
          .string()
          .required("Invite code is required")
          .matches(
            /^ttlic_[a-zA-Z0-9]{32}$/,
            "Friend code must start with \"ttlic_\", and be followed by 24 alphanumeric characters.")
      })}
      onSubmit={values => {
        onJoin(values.leaderboardCode).catch((e: unknown) => {
          console.log(e);
          if (axios.isAxiosError(e)) {
            if (e.response?.status === 409) {
              setError("You are already a member of this leaderboard");
            }
            else {
              setError("Error joining leaderboard");
            }
          }
          else {
            setError("Error joining leaderboard");
          }
        });
      }}
    >
      {() => <Form onChange={() => {
        setError("");
      }}>
        <FormikTextInput
          name="leaderboardCode"
          label="Leaderboard Code"
          placeholder={placeholderLeaderboardInviteCode}
          styles={theme => ({
            invalid: {
              "::placeholder": {
                color: theme.fn.rgba(theme.colors.red[5], 0.4)
              }
            }
          })}
        />
        <Group position="right" mt="md">
          <Button
            type="submit"
            leftIcon={<EnterIcon />}
          >
            Join
          </Button>
        </Group>
      </Form>}
    </Formik>
    {error && <Text color="red">{error}</Text>}
  </>;
};
