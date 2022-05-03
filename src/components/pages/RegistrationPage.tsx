import { Button, Title, LoadingOverlay } from "@mantine/core";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import { useState } from "react";
import useAuthentication from "../../hooks/UseAuthentication";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { handleErrorWithNotification } from "../../utils/notificationErrorHandler";

export const RegistrationPage = () => {
  const { register } = useAuthentication();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  return <div>
    <Title order={1} mb={20}>Register</Title>
    <Formik
      initialValues={{
        username: "",
        password: "",
        passwordConfirmation: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required("Username is required")
          .min(2, "Username must be at least 2 characters long")
          .max(32, "Username can not be more than 32 characters long"),
        password: Yup.string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters long")
          .max(128, "Password can not be more than 128 characters long"),
        passwordConfirmation: Yup.string()
          .required("Password confirmation is required")
          .oneOf([Yup.ref("password"), null], "Passwords must match")
      })}
      onSubmit={values => {
        setVisible(true);
        register(values.username, values.password)
          .then(() => navigate("/"))
          .catch((...e) => {handleErrorWithNotification(...e); setVisible(false);});
      }}>
      {() => <Form>
        <FormikTextInput name="username" label="Username" />
        <FormikPasswordInput name="password" label="Password" mt={15} />
        <FormikPasswordInput name="passwordConfirmation" label="Confirm password" mt={15} />
        <Button mt={20} type="submit"><LoadingOverlay visible={visible} />Register</Button>
      </Form>}
    </Formik>
  </div>;
};