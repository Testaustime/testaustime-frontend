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
      <LoginForm />
    </Group>
  );
}
