import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { Button, Group } from "@mantine/core";
import axios from "../../axios";
import { useRouter } from "next/navigation";

export type EditProjectModalProps = {
  projectName: string;
  onClose: () => void;
  texts: {
    projectName: string;
    save: string;
  };
};

export const EditProjectModal = ({
  projectName,
  onClose,
  texts,
}: EditProjectModalProps) => {
  const router = useRouter();

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
            <FormikTextInput name="projectName" label={texts.projectName} />
            <Group justify="right" mt="md">
              <Button type="submit">{texts.save}</Button>
            </Group>
          </Form>
        )}
      </Formik>
    </>
  );
};
