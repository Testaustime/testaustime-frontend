import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Title, LoadingOverlay } from "@mantine/core";
import { Form, Formik } from "formik";
import { FormikTextInput } from "../../components/forms/FormikTextInput";
import * as Yup from "yup";
import { useState } from "react";
import { RegistrationResult, useAuthentication } from "../../hooks/useAuthentication";
import { FormikPasswordInput } from "../../components/forms/FormikPasswordInput";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const RegistrationPage = () => {
  const { register } = useAuthentication();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return <div>
    <Title order={1} mb={20}>{t("navbar.register")}</Title>
    <Formik
      initialValues={{
        username: "",
        password: "",
        passwordConfirmation: ""
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required(t("registrationPage.validation.username.required"))
          .min(2, t("registrationPage.validation.username.min", { min: 2 }))
          .max(32, t("registrationPage.validation.username.max", { max: 32 }))
          .matches(/^[a-zA-Z0-9]*$/, t("registrationPage.validation.username.regex")),
        password: Yup.string()
          .required(t("registrationPage.validation.password.required"))
          .min(8, t("registrationPage.validation.password.min", { min: 8 }))
          .max(128, t("registrationPage.validation.password.max", { max: 128 })),
        passwordConfirmation: Yup.string()
          .required(t("registrationPage.validation.passwordConfirm.required"))
          .oneOf([Yup.ref("password")], t("registrationPage.validation.passwordConfirm.noMatch"))
      })}
      onSubmit={values => {
        setVisible(true);
        register(values.username, values.password)
          .then(result => {
            if (result === RegistrationResult.Success) {
              return router.push("/");
            }
            else if (result === RegistrationResult.RateLimited) {
              showNotification({
                title: t("error"),
                color: "red",
                message: t("registrationPage.rateLimited")
              });
              setVisible(false);
            }
          }).catch(() => {
            showNotification({
              title: t("error"),
              color: "red",
              message: t("unknownErrorOccurred")
            });
            setVisible(false);
          });
      }}>
      {() => <Form>
        <FormikTextInput name="username" label={t("registrationPage.username")} />
        <FormikPasswordInput name="password" label={t("registrationPage.password")} mt={15} />
        <FormikPasswordInput name="passwordConfirmation" label={t("registrationPage.passwordConfirm")} mt={15} />
        <Button mt={20} type="submit">
          <LoadingOverlay visible={visible} />{t("registrationPage.registerButton")}
        </Button>
      </Form>}
    </Formik>
  </div>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale ?? "en")
});

export default RegistrationPage;
