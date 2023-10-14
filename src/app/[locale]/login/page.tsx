import { Title, Group } from "@mantine/core";
import LoginForm from "../../../components/LoginForm";
import initTranslations from "../../i18n";

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <Group>
      <Title order={1} mb={20}>
        {t("loginPage.title")}
      </Title>
      <LoginForm
        texts={{
          username: t("loginPage.username"),
          password: t("loginPage.password"),
          error: t("error"),
          invalidCredentials: t("loginPage.invalidCredentials"),
          loginButton: t("loginPage.loginButton"),
          passwordRequired: t("loginPage.validation.password.required"),
          usernameRequired: t("loginPage.validation.username.required"),
        }}
      />
    </Group>
  );
}
