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
      <RegistrationForm
        texts={{
          username: t("registrationPage.username"),
          password: t("registrationPage.password"),
          passwordConfirm: t("registrationPage.passwordConfirm"),
          registerButton: t("registrationPage.registerButton"),
          errors: {
            error: t("error"),
            rateLimited: t("registrationPage.rateLimited"),
            unknown: t("unknownErrorOccurred"),
            username: {
              required: t("registrationPage.validation.username.required"),
              min: t("registrationPage.validation.username.min", { min: 2 }),
              max: t("registrationPage.validation.username.max", { max: 32 }),
              regex: t("registrationPage.validation.username.regex"),
            },
            password: {
              required: t("registrationPage.validation.password.required"),
              min: t("registrationPage.validation.password.min", { min: 8 }),
              max: t("registrationPage.validation.password.max", { max: 128 }),
            },
            passwordConfirm: {
              required: t(
                "registrationPage.validation.passwordConfirm.required",
              ),
              noMatch: t("registrationPage.validation.passwordConfirm.noMatch"),
            },
          },
        }}
      />
    </div>
  );
}
