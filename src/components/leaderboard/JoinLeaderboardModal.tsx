import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button } from "@mantine/core";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { JoinLeaderboardError } from "../../types";
import { joinLeaderboard } from "./actions";

interface JoinLeaderboardModalProps {
  initialCode: string | null;
  onJoin: () => void;
  username: string;
}

export const JoinLeaderboardModal = ({
  initialCode,
  onJoin,
  username,
}: JoinLeaderboardModalProps) => {
  const [placeholderLeaderboardInviteCode] = useState(
    generateLeaderboardInviteCode(),
  );
  const { t } = useTranslation();

  return (
    <>
      <Formik
        initialValues={{
          leaderboardCode: initialCode ?? "",
        }}
        validationSchema={Yup.object().shape({
          leaderboardCode: Yup.string()
            .required(t("leaderboards.join.leaderboardCodeRequired"))
            .matches(
              /^ttlic_[a-zA-Z0-9]{32}$/,
              t("leaderboards.join.leaderboardCodeInvalid"),
            ),
        })}
        onSubmit={async (values) => {
          const result = await joinLeaderboard(
            values.leaderboardCode,
            username,
          );
          if (typeof result === "object") {
            onJoin();
          } else {
            showNotification({
              title: t("error"),
              color: "red",
              message: {
                [JoinLeaderboardError.AlreadyMember]: t(
                  "leaderboards.join.alreadyMember",
                ),
                [JoinLeaderboardError.NotFound]: t(
                  "leaderboards.join.notFound",
                ),
                [JoinLeaderboardError.UnknownError]: t(
                  "leaderboards.join.genericError",
                ),
              }[result],
            });
          }
        }}
      >
        {() => (
          <Form>
            <FormikTextInput
              name="leaderboardCode"
              label={t("leaderboards.join.leaderboardCode")}
              placeholder={placeholderLeaderboardInviteCode}
            />
            <Group justify="right" mt="md">
              <Button type="submit" leftSection={<EnterIcon />}>
                {t("leaderboards.join.join")}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </>
  );
};
