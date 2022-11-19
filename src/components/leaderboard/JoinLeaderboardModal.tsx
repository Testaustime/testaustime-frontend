import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button, Text } from "@mantine/core";
import axios from "axios";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";
import { useI18nContext } from "../../i18n/i18n-react";

interface JoinLeaderboardModalProps {
  initialCode: string | null,
  onJoin: (leaderboardCode: string) => Promise<void>
}

export const JoinLeaderboardModal = ({ initialCode, onJoin }: JoinLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");
  const [placeholderLeaderboardInviteCode] = useState(generateLeaderboardInviteCode());
  const { LL } = useI18nContext();

  return <>
    <Formik
      initialValues={{
        leaderboardCode: initialCode ?? ""
      }}
      validationSchema={Yup.object().shape({
        leaderboardCode: Yup
          .string()
          .required(LL.leaderboards.join.leaderboardCodeRequired())
          .matches(/^ttlic_[a-zA-Z0-9]{32}$/, LL.leaderboards.join.leaderboardCodeInvalid())
      })}
      onSubmit={values => {
        onJoin(values.leaderboardCode).catch((e: unknown) => {
          console.log(e);
          if (axios.isAxiosError(e)) {
            if (e.response?.status === 409) {
              setError(LL.leaderboards.join.alreadyMember());
            }
            else {
              setError(LL.leaderboards.join.genericError());
            }
          }
          else {
            setError(LL.leaderboards.join.genericError());
          }
        });
      }}
    >
      {() => <Form onChange={() => {
        setError("");
      }}>
        <FormikTextInput
          name="leaderboardCode"
          label={LL.leaderboards.join.leaderboardCode()}
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
            {LL.leaderboards.join.join()}
          </Button>
        </Group>
      </Form>}
    </Formik>
    {error && <Text color="red">{error}</Text>}
  </>;
};
