import { Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useI18nContext } from "../../i18n/i18n-react";
import * as Yup from "yup";
import { useState } from "react";
import { Form, Formik } from "formik";
import { FormikPasswordInput } from "../forms/FormikPasswordInput";

export type ConfirmAccountDeletionModalProps = {
  onCancel: () => void,
  onConfirm: (password: string) => Promise<void>
};

export const ConfirmAccountDeletionModal = ({ onCancel, onConfirm }: ConfirmAccountDeletionModalProps) => {
  const { LL } = useI18nContext();
  const [loading, setLoading] = useState(false);

  return <div>
    <Text>{LL.profile.deleteAccount.modal.text()}</Text>
    <Formik
      initialValues={{
        password: ""
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().required(LL.loginPage.validation.password.required())
      })}
      onSubmit={async values => {
        setLoading(true);
        await onConfirm(values.password);
        setLoading(false);
      }}>
      {() => <Form style={{ width: "100%", display: "flex", gap: "2rem", flexDirection: "column" }}>
        <FormikPasswordInput name="password" label={LL.loginPage.password()} mt={15} style={{ width: "100%" }} />
        <Group position="right">
          <Button variant="outline" onClick={() => onCancel()}>{LL.prompt.cancel()}</Button>
          <Button color="red" type="submit">
            <LoadingOverlay visible={loading} />
            {LL.profile.deleteAccount.modal.button()}
          </Button>
        </Group>
      </Form>}
    </Formik>
  </div>;
};
