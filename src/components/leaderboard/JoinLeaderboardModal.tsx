import { useState } from "react";
import { generateLeaderboardInviteCode } from "../../utils/codeUtils";
import * as Yup from "yup";
import { Group, Button } from "@mantine/core";
import { Formik, Form } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { EnterIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import axios from "../../axios";
import { isAxiosError } from "axios";

interface JoinLeaderboardModalProps {
  initialCode: string | null;
  onJoin: (leaderboardCode: string) => void;
}

export enum JoinLeaderboardError {
  AlreadyMember,
  NotFound,
  UnknownError,
}

const joinLeaderboard = async (inviteCode: string) => {
  try {
    const res = await axios.post<{ name: string; member_count: number }>(
      "/leaderboards/join",
      {
        invite: inviteCode,
      },
    );
    return res.data;
  } catch (e) {
    if (isAxiosError(e)) {
      if (
        e.response?.status === 409 ||
        // TODO: The 403 status is a bug with the backend.
        // It can be removed when https://github.com/Testaustime/testaustime-backend/pull/61 is merged
        e.response?.status === 403
      ) {
        return JoinLeaderboardError.AlreadyMember;
      } else if (e.response?.status === 404) {
        return JoinLeaderboardError.NotFound;
      }
    }
    return JoinLeaderboardError.UnknownError;
  }
};

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
          if (typeof result === "object") {
            onJoin(values.leaderboardCode);
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
