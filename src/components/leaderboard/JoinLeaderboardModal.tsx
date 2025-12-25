import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button } from "@mantine/core";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { JoinLeaderboardError, PostRequestError } from "../../types";
import { joinLeaderboard } from "./actions";

interface JoinLeaderboardModalProps {
  initialCode: string | null;
  onJoin: () => void;
}

export const JoinLeaderboardModal = ({
  initialCode,
  onJoin,
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
          const result = await joinLeaderboard(values.leaderboardCode);
          if ("error" in result) {
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
                [PostRequestError.RateLimited]: t("rateLimitedError"),
                [PostRequestError.Unauthorized]: t("errors.unauthorized"),
                [PostRequestError.UnknownError]: t(
                  "leaderboards.join.genericError",
                ),
              }[result.error],
            });
          } else {
            onJoin();
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
