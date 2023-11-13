import { Title } from "@mantine/core";
import { RegistrationForm } from "./RegistrationForm";
import initTranslations from "../../i18n";

export default async function RegistrationPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <div>
      <Title order={1} mb={20}>
        {t("navbar.register")}
      </Title>
      <RegistrationForm />
    </div>
  );
}
