import { Title, Group } from "@mantine/core";
import { useAuthentication } from "../../../hooks/useAuthentication";
import { showNotification } from "@mantine/notifications";
import LoginForm from "../../../components/LoginForm";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageLayout } from "../../../components/PageLayout";

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

const LoginPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { login } = useAuthentication();
  const router = useRouter();
  const queryParams = router.query;
  const unsafeRedirect = String(queryParams.redirect ?? "/");
  const { t } = useTranslation();

  return (
    <PageLayout isLoggedIn={false} t={t} locale={props.locale}>
      <Group>
        <Title order={1} mb={20}>
          {t("loginPage.title")}
        </Title>
        <LoginForm
          onLogin={async (username, password) => {
            try {
              await login(username, password);
              await router.push(
                allowedRedirects.includes(unsafeRedirect)
                  ? unsafeRedirect
                  : "/",
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
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  locale: string;
}> = async ({ params }) => {
  return {
    props: {
      ...(await serverSideTranslations(String(params?.locale ?? "en"))),
      locale: String(params?.locale ?? "en"),
    },
  };
};

export default LoginPage;
