import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FormikTextInput } from "../forms/FormikTextInput";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { Button, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useI18nContext } from "../../i18n/i18n-react";

export type LoginFormProps = {
  onLogin: (username: string, password: string) => Promise<void>
}

export const LoginForm = (props: LoginFormProps) => {
  const [visible, setVisible] = useState(false);
  const { LL } = useI18nContext();

  return <Formik
    initialValues={{
      username: "",
      password: ""
    }}
    validationSchema={Yup.object().shape({
      username: Yup.string().required(LL.loginPage.validation.username.required()),
      password: Yup.string().required(LL.loginPage.validation.password.required())
    })}
    onSubmit={async values => {
      setVisible(true);
      await props.onLogin(values.username, values.password);
      setVisible(false);
    }}>
    {() => <Form style={{ width: "100%" }}>
      <FormikTextInput name="username" label={LL.loginPage.username()} style={{ width: "100%" }} />
      <FormikPasswordInput name="password" label={LL.loginPage.password()} mt={15} style={{ width: "100%" }} />
      <Button mt={20} type="submit">
        <LoadingOverlay visible={visible} />
        {LL.loginPage.loginButton()}
      </Button>
    </Form>}
  </Formik>;
};
