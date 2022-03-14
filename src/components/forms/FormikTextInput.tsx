import { TextInput, TextInputProps } from "@mantine/core";
import { useField } from "formik";

interface FormikTextInputProps {
  name: string
}

export const FormikTextInput = (props: FormikTextInputProps & TextInputProps) => {
  const [field, meta] = useField(props.name);
  return <TextInput error={meta.error} {...props} {...field} />;
};
