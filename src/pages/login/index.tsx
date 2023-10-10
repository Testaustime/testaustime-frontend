import { Title, Group } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { showNotification } from "@mantine/notifications";
import LoginForm from "../../components/LoginForm";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

const LoginPage = () => {
  const { login } = useAuthentication();
  const router = useRouter();
  const queryParams = router.query;
  const unsafeRedirect = String(queryParams.redirect ?? "/");
  const { t } = useTranslation();

  return (
    <Group>
      <Title order={1} mb={20}>
        {t("loginPage.title")}
      </Title>
      <LoginForm
        onLogin={async (username, password) => {
          try {
            await login(username, password);
            await router.push(
              allowedRedirects.includes(unsafeRedirect) ? unsafeRedirect : "/",
            );
          } catch (e) {
            showNotification({
              title: t("error"),
              color: "red",
              message: t("loginPage.invalidCredentials"),
            });
          }
        }}
      />
    </Group>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale ?? "en"),
});

export default LoginPage;
