import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { Button, Group } from "@mantine/core";
import { useActivity } from "../../hooks/useActivities";
import { useI18nContext } from "../../i18n/i18n-react";

export type EditProjectModalProps = {
  projectName: string,
  onClose: () => void
};

export const EditProjectModal = ({ projectName, onClose }: EditProjectModalProps) => {
  const activity = useActivity(projectName);
  const { LL } = useI18nContext();

  return <>
    <Formik
      initialValues={{ projectName }}
      onSubmit={async values => {
        try {
          await activity.renameProject(values.projectName);
          onClose();
        } catch (e) {
          console.error(e);
        }
      }}
    >
      {() => <Form>
        <FormikTextInput name="projectName" label={LL.editProject.projectName()} />
        <Group position="right" mt="md">
          <Button type="submit">{LL.editProject.save()}</Button>
        </Group>
      </Form>}
    </Formik>
  </>;
};
