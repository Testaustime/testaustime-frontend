"use client";

import { Group, Button } from "@mantine/core";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { showNotification } from "@mantine/notifications";
import { createLeaderboard } from "../../api/leaderboardApi";
import { CreateLeaderboardError } from "../../types";

interface CreateLeaderboardModalProps {
  onCreate: (leaderboardName: string) => void;
  texts: {
    error: string;
    leaderboardExists: string;
    leaderboardCreateError: string;
    validation: {
      required: string;
      min: string;
      max: string;
      regex: string;
    };
    create: string;
  };
}

export const CreateLeaderboardModal = ({
  onCreate,
  texts,
}: CreateLeaderboardModalProps) => {
  return (
    <>
      <Formik
        initialValues={{
          leaderboardName: "",
        }}
        onSubmit={async (values) => {
          const result = await createLeaderboard(values.leaderboardName);
          if (typeof result === "object") {
            onCreate(values.leaderboardName);
          } else {
            showNotification({
              title: texts.error,
              color: "red",
              message: {
                [CreateLeaderboardError.AlreadyExists]: texts.leaderboardExists,
                [CreateLeaderboardError.UnknownError]:
                  texts.leaderboardCreateError,
              }[result],
            });
          }
        }}
        validationSchema={Yup.object().shape({
          leaderboardName: Yup.string()
            .required(texts.validation.required)
            .min(2, texts.validation.min)
            .max(32, texts.validation.max)
            .matches(/^[a-zA-Z0-9]*$/, texts.validation.regex),
        })}
      >
        {() => (
          <Form>
            <FormikTextInput name="leaderboardName" />
            <Group justify="right" mt="md">
              <Button type="submit">{texts.create}</Button>
            </Group>
          </Form>
        )}
      </Formik>
    </>
  );
};
