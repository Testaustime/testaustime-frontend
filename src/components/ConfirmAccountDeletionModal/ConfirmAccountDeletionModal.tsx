import { Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useState } from "react";
import { Form, Formik } from "formik";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";

export type ConfirmAccountDeletionModalProps = {
  onCancel: () => void,
  onConfirm: (password: string) => Promise<void>
};

export const ConfirmAccountDeletionModal = ({ onCancel, onConfirm }: ConfirmAccountDeletionModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return <div>
    <Text>{t("profile.deleteAccount.modal.text")}</Text>
    <Formik
      initialValues={{
        password: ""
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().required(t("loginPage.validation.password.required"))
      })}
      onSubmit={async values => {
        setLoading(true);
        await onConfirm(values.password);
        setLoading(false);
      }}>
      {() => <Form style={{ width: "100%", display: "flex", gap: "2rem", flexDirection: "column" }}>
        <FormikPasswordInput name="password" label={t("loginPage.password")} mt={15} style={{ width: "100%" }} />
        <Group position="right">
          <Button variant="outline" onClick={() => onCancel()}>{t("prompt.cancel")}</Button>
          <Button color="red" type="submit">
            <LoadingOverlay visible={loading} />
            {t("profile.deleteAccount.modal.button")}
          </Button>
        </Group>
      </Form>}
    </Formik>
  </div>;
};
