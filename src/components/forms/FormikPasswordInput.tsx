import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { useField } from "formik";

interface FormikPasswordInputProps {
  name: string
}

export const FormikPasswordInput = (props: FormikPasswordInputProps & PasswordInputProps) => {
  const [field, meta] = useField(props.name);
  return <PasswordInput error={meta.error} {...field} {...props}  />;
};
