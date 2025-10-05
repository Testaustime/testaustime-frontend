import { Title, Group } from "@mantine/core";
import { PasswordResetForm } from "./PasswordResetForm";
import initTranslations from "../../i18n";

export default async function PasswordResetRequestPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <Group>
      <Title order={1} mb={20}>
        {t("passwordResetPage.title")}
      </Title>
      <PasswordResetForm />
    </Group>
  );
}
