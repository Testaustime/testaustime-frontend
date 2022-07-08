import { Group, Button, Text } from "@mantine/core";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => Promise<void>
}

export const CreateLeaderboardModal = ({ onCreate }: CreateLeaderboardModalProps) => {
  const [error, setError] = useState<string>("");

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
                setError("Leaderboard already exists");
              }
              else {
                setError("Error creating leaderboard");
              }
            }
            else {
              setError("Error creating leaderboard");
            }
          });
      }}
      validationSchema={Yup.object().shape({
        leaderboardName: Yup.string()
          .required("Leaderboard name is required")
          .min(2, "Leaderboard name must be at least 2 characters long")
          .max(32, "Leaderboard name must be at most 32 characters long")
          .matches(/^[a-zA-Z0-9]*$/, "Leaderboard name must only contain alphanumeric characters")
      })}
    >
      {() => <Form>
        <FormikTextInput name="leaderboardName" />
        <Group position="right" mt="md">
          <Button type="submit">Create</Button>
        </Group>
      </Form>}
    </Formik>
    {error && <Text color="red">{error}</Text>}
  </>;
};