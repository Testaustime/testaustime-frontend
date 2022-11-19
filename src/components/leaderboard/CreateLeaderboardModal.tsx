import { Group, Button, Text } from "@mantine/core";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useI18nContext } from "../../i18n/i18n-react";
import { FormikTextInput } from "../forms/FormikTextInput";

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => Promise<void>
}

export const CreateLeaderboardModal = ({ onCreate }: CreateLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");
  const { LL } = useI18nContext();

  return <>
    <Formik
      initialValues={{
        leaderboardName: ""
      }}
      onSubmit={values => {
        onCreate(values.leaderboardName)
          .catch(e => {
            if (axios.isAxiosError(e)) {
              if (e.response?.status === 409) {
                setError(LL.leaderboards.leaderboardExists());
              }
              else {
                setError(LL.leaderboards.leaderboardCreateError());
              }
            }
            else {
              setError(LL.leaderboards.leaderboardCreateError());
            }
          });
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
    {error && <Text color="red">{error}</Text>}
  </>;
};
