import { Button, Title, LoadingOverlay } from "@mantine/core";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { showNotification } from "@mantine/notifications";
import { useI18nContext } from "../../i18n/i18n-react";

export const RegistrationPage = () => {
  const { register } = useAuthentication();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { LL } = useI18nContext();

  return <div>
    <Title order={1} mb={20}>{LL.navbar.register()}</Title>
    <Formik
      initialValues={{
        username: "",
        password: "",
        passwordConfirmation: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required(LL.registrationPage.validation.username.required())
          .min(2, LL.registrationPage.validation.username.min({ min: 2 }))
          .max(32, LL.registrationPage.validation.username.max({ max: 32 }))
          .matches(/^[a-zA-Z0-9]*$/, LL.registrationPage.validation.username.regex()),
        password: Yup.string()
          .required(LL.registrationPage.validation.password.required())
          .min(8, LL.registrationPage.validation.password.min({ min: 8 }))
          .max(128, LL.registrationPage.validation.password.max({ max: 128 })),
        passwordConfirmation: Yup.string()
          .required(LL.registrationPage.validation.passwordConfirm.required())
          .oneOf([Yup.ref("password")], LL.registrationPage.validation.passwordConfirm.noMatch())
      })}
      onSubmit={values => {
        setVisible(true);
        register(values.username, values.password)
          .then(() => navigate("/"))
          .catch(() => {
            showNotification({
              title: LL.error(),
              color: "red",
              message: LL.registrationPage.invalidCredentials()
            });
            setVisible(false);
          });
      }}>
      {() => <Form>
        <FormikTextInput name="username" label={LL.registrationPage.username()} />
        <FormikPasswordInput name="password" label={LL.registrationPage.password()} mt={15} />
        <FormikPasswordInput name="passwordConfirmation" label={LL.registrationPage.passwordConfirm()} mt={15} />
        <Button mt={20} type="submit">
          <LoadingOverlay visible={visible} />{LL.registrationPage.registerButton()}
        </Button>
      </Form>}
    </Formik>
  </div>;
};