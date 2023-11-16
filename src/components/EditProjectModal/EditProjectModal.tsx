import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { Button, Group } from "@mantine/core";
import axios from "../../axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type EditProjectModalProps = {
  projectName: string;
  onClose: () => void;
};

export const EditProjectModal = ({
  projectName,
  onClose,
}: EditProjectModalProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Formik
        initialValues={{ projectName }}
        onSubmit={async (values) => {
          try {
            await axios.post("/activity/rename", {
              from: projectName,
              to: values.projectName,
            });
            router.refresh();
            onClose();
          } catch (e) {
            console.error(e);
          }
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
