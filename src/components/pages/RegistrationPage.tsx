import { Button, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { FormikTextInput } from "../forms/FormikTextInput";
import * as Yup from "yup";
import useAuthentication from "../../hooks/UseAuthentication";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";

export const RegistrationPage = () => {
  const { register } = useAuthentication();
  const navigate = useNavigate();
  const notifications = useNotifications();

  return <div>
    <Title order={1} mb={20}>Register</Title>
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters long")
      })}
      onSubmit={values => {
        register(values.username, values.password).then(() => {
          navigate("/");
        }).catch(error => {
          notifications.showNotification({
            title: "Error",
            color: "red",
            message: String(error || "An unknown error occurred")
          });
        });
      }}>
      {() => <Form>
        <FormikTextInput name="username" label="Username" />
        <FormikPasswordInput name="password" label="Password" mt={15} />
        <Button mt={20} type="submit">Register</Button>
      </Form>}
    </Formik>
  </div>;
};