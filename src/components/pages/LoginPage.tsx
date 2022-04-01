import { Button, Title } from "@mantine/core";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import useAuthentication from "../../hooks/UseAuthentication";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";
import { handleErrorWithNotification } from "../../utils/notificationErrorHandler";

export const LoginPage = () => {
  const { login } = useAuthentication();
  const navigate = useNavigate();

  return <div>
    <Title order={1} mb={20}>Login</Title>
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required")
      })}
      onSubmit={values => {
        login(values.username, values.password)
          .then(() => navigate("/"))
          .catch(handleErrorWithNotification);
      }}>
      {() => <Form>
        <FormikTextInput name="username" label="Username" />
        <FormikPasswordInput name="password" label="Password" mt={15} />
        <Button mt={20} type="submit">Log in</Button>
      </Form>}
    </Formik>
  </div>;
};