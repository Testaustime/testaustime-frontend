"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import axios from "../../../axios";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../../../lib/errorHandling/errorHandler";
import { showNotification } from "@mantine/notifications";
import { FormikTextInput } from "../../../components/forms/FormikTextInput";
import { FormikPasswordInput } from "../../../components/forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";

export enum RegistrationResult {
  Success,
  RateLimited,
}

export interface ApiAuthRegisterResponse {
  auth_token: string;
  username: string;
  friend_code: string;
  registration_time: string;
}

type RegistrationFormProps = {
  texts: {
    username: string;
    password: string;
    passwordConfirm: string;
    registerButton: string;
    errors: {
      username: {
        required: string;
        min: string;
        max: string;
        regex: string;
      };
      password: {
        required: string;
        min: string;
        max: string;
      };
      passwordConfirm: {
        required: string;
        noMatch: string;
      };
      error: string;
      rateLimited: string;
      unknown: string;
    };
  };
};

export const RegistrationForm = ({ texts }: RegistrationFormProps) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const register = async (username: string, password: string) => {
    try {
      await axios.post<ApiAuthRegisterResponse>("/auth/register", {
        username,
        password,
      });
      return RegistrationResult.Success;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 429) {
          return RegistrationResult.RateLimited;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw getErrorMessage(error);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required(texts.errors.username.required)
          .min(2, texts.errors.username.min)
          .max(32, texts.errors.username.max)
          .matches(/^[a-zA-Z0-9]*$/, texts.errors.username.regex),
        password: Yup.string()
          .required(texts.errors.password.required)
          .min(8, texts.errors.password.min)
          .max(128, texts.errors.password.max),
        passwordConfirmation: Yup.string()
          .required(texts.errors.passwordConfirm.required)
          .oneOf([Yup.ref("password")], texts.errors.passwordConfirm.noMatch),
      })}
      onSubmit={(values) => {
        setVisible(true);
        register(values.username, values.password)
          .then((result) => {
            switch (result) {
              case RegistrationResult.Success:
                router.push("/");
                break;
              case RegistrationResult.RateLimited:
                showNotification({
                  title: texts.errors.error,
                  color: "red",
                  message: texts.errors.rateLimited,
                });
                setVisible(false);
                break;
            }
          })
          .catch(() => {
            showNotification({
              title: texts.errors.error,
              color: "red",
              message: texts.errors.unknown,
              autoClose: false,
            });
            setVisible(false);
          });
      }}
    >
      {() => (
        <Form>
          <FormikTextInput name="username" label={texts.username} />
          <FormikPasswordInput name="password" label={texts.password} mt={15} />
          <FormikPasswordInput
            name="passwordConfirmation"
            label={texts.passwordConfirm}
            mt={15}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {texts.registerButton}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
