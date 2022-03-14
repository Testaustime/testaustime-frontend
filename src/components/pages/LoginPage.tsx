import { Button, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";

export const LoginPage = () => {
  const { login } = useLogin();
  const navigate = useNavigate();
  const notifications = useNotifications();

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
        login(values.username, values.password).then(() => {
          navigate("/");
        }).catch(error => {
          notifications.showNotification({
            title: "Error",
            color: "red",
            message: String(error.response.data)
          });
        });
      }}>
      {() => <Form>
        <FormikTextInput name="username" label="Username" />
        <FormikTextInput name="password" label="Password" type="password" mt={15} />
        <Button mt={20} type="submit">Log in</Button>
      </Form>}
    </Formik>
  </div>;
};