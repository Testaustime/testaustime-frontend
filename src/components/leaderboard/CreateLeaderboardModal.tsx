import { Group, Button } from "@mantine/core";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useI18nContext } from "../../i18n/i18n-react";
import { FormikTextInput } from "../forms/FormikTextInput";
import { CreateLeaderboardError, useLeaderboards } from "../../hooks/useLeaderboards";
import { showNotification } from "@mantine/notifications";

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => void
}

export const CreateLeaderboardModal = ({ onCreate }: CreateLeaderboardModalProps) => {
  const { LL } = useI18nContext();
  const { createLeaderboard } = useLeaderboards();

  return <>
    <Formik
      initialValues={{
        leaderboardName: ""
      }}
      onSubmit={async values => {
        const result = await createLeaderboard(values.leaderboardName);
        if (typeof result === "object") {
          onCreate(values.leaderboardName);
        }
        else {
          showNotification({
            title: LL.error(),
            color: "red",
            message: {
              [CreateLeaderboardError.AlreadyExists]: LL.leaderboards.leaderboardExists(),
              [CreateLeaderboardError.UnknownError]: LL.leaderboards.leaderboardCreateError()
            }[result]
          });
        }
      }}
      validationSchema={Yup.object().shape({
        leaderboardName: Yup.string()
          .required(LL.leaderboards.validation.required())
          .min(2, LL.leaderboards.validation.min({ min: 2 }))
          .max(32, LL.leaderboards.validation.max({ max: 32 }))
          .matches(/^[a-zA-Z0-9]*$/, LL.leaderboards.validation.regex())
      })}
    >
      {() => <Form>
        <FormikTextInput name="leaderboardName" />
        <Group position="right" mt="md">
          <Button type="submit">{LL.leaderboards.create()}</Button>
        </Group>
      </Form>}
    </Formik>
  </>;
};
