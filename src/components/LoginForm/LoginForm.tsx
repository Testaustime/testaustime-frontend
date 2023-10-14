"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import axios from "../../axios";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMessage } from "../../lib/errorHandling/errorHandler";
import { showNotification } from "@mantine/notifications";
import { ApiAuthLoginResponse } from "../../pages/api/auth/login";

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

export type LoginFormProps = {
  texts: {
    username: string;
    password: string;
    loginButton: string;
    error: string;
    invalidCredentials: string;
    usernameRequired: string;
    passwordRequired: string;
  };
};

export const LoginForm = ({ texts }: LoginFormProps) => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const unsafeRedirect = String(searchParams.get("redirect") ?? "/");

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required(texts.usernameRequired),
        password: Yup.string().required(texts.passwordRequired),
      })}
      onSubmit={async (values) => {
        setVisible(true);
        try {
          try {
            await axios.post<ApiAuthLoginResponse>("/auth/login", {
              username: values.username,
              password: values.password,
            });
          } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw getErrorMessage(error);
          }

          router.push(
            allowedRedirects.includes(unsafeRedirect) ? unsafeRedirect : "/",
          );
        } catch (e) {
          showNotification({
            title: texts.error,
            color: "red",
            message: texts.invalidCredentials,
          });
        }
        setVisible(false);
      }}
    >
      {() => (
        <Form style={{ width: "100%" }}>
          <FormikTextInput
            name="username"
            label={texts.username}
            style={{ width: "100%" }}
          />
          <FormikPasswordInput
            name="password"
            label={texts.password}
            mt={15}
            style={{ width: "100%" }}
          />
          <Button mt={20} type="submit">
            <LoadingOverlay visible={visible} />
            {texts.loginButton}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
