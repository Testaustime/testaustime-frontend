import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
export type LoginFormProps = {
  onLogin: (username: string, password: string) => Promise<void>
}

export const LoginForm = (props: LoginFormProps) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return <Formik
    initialValues={{
      username: "",
      password: ""
    }}
    validationSchema={Yup.object().shape({
      username: Yup.string().required(t("loginPage.validation.username.required")),
      password: Yup.string().required(t("loginPage.validation.password.required"))
    })}
    onSubmit={async values => {
      setVisible(true);
      await props.onLogin(values.username, values.password);
      setVisible(false);
    }}>
    {() => <Form style={{ width: "100%" }}>
      <FormikTextInput name="username" label={t("loginPage.username")} style={{ width: "100%" }} />
      <FormikPasswordInput name="password" label={t("loginPage.password")} mt={15} style={{ width: "100%" }} />
      <Button mt={20} type="submit">
        <LoadingOverlay visible={visible} />
        {t("loginPage.loginButton")}
      </Button>
    </Form>}
  </Formik>;
};
