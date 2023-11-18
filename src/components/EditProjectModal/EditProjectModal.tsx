import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { Button, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { renameProject } from "./actions";

type EditProjectModalProps = {
  projectName: string;
  onClose: () => void;
};

export const EditProjectModal = ({
  projectName,
  onClose,
}: EditProjectModalProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Formik
        initialValues={{ projectName }}
        onSubmit={async (values) => {
          await renameProject(projectName, values.projectName);
          onClose();
        }}
      >
        {() => (
          <Form>
            <FormikTextInput
              name="projectName"
              label={t("editProject.projectName")}
            />
            <Group justify="right" mt="md">
              <Button type="submit">{t("editProject.save")}</Button>
            </Group>
          </Form>
        )}
      </Formik>
    </>
  );
};
