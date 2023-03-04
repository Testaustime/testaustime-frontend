import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button } from "@mantine/core";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { JoinLeaderboardError, useLeaderboards } from "../../hooks/useLeaderboards";
import { showNotification } from "@mantine/notifications";

interface JoinLeaderboardModalProps {
  initialCode: string | null,
  onJoin: (leaderboardCode: string) => void
}

export const JoinLeaderboardModal = ({ initialCode, onJoin }: JoinLeaderboardModalProps) => {
  const [placeholderLeaderboardInviteCode] = useState(generateLeaderboardInviteCode());
  const { t } = useTranslation();
  const { joinLeaderboard } = useLeaderboards();

  return <>
    <Formik
      initialValues={{
        leaderboardCode: initialCode ?? ""
      }}
      validationSchema={Yup.object().shape({
        leaderboardCode: Yup
          .string()
          .required(t("leaderboards.join.leaderboardCodeRequired"))
          .matches(/^ttlic_[a-zA-Z0-9]{32}$/, t("leaderboards.join.leaderboardCodeInvalid"))
      })}
      onSubmit={async values => {
        const result = await joinLeaderboard(values.leaderboardCode);
        if (typeof result === "object") {
          onJoin(values.leaderboardCode);
        }
        else {
          showNotification({
            title: t("error"),
            color: "red",
            message: {
              [JoinLeaderboardError.AlreadyMember]: t("leaderboards.join.alreadyMember"),
              [JoinLeaderboardError.NotFound]: t("leaderboards.join.notFound"),
              [JoinLeaderboardError.UnknownError]: t("leaderboards.join.genericError")
            }[result]
          });
        }
      }}
    >
      {() => <Form>
        <FormikTextInput
          name="leaderboardCode"
          label={t("leaderboards.join.leaderboardCode")}
          placeholder={placeholderLeaderboardInviteCode}
          styles={{
            input: {
              "&[data-invalid]::placeholder": {
                opacity: 0.5
              }
            }
          }}
        />
        <Group position="right" mt="md">
          <Button
            type="submit"
            leftIcon={<EnterIcon />}
          >
            {t("leaderboards.join.join")}
          </Button>
        </Group>
      </Form>}
    </Formik>
  </>;
};
