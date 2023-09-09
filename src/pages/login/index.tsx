import { Title, Group, createStyles } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { showNotification } from "@mantine/notifications";
import LoginForm from "../../components/LoginForm";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const useStyles = createStyles(() => ({
  loginBox: {
    display: "flex",
    height: "calc(100% - 36px - 50px - 80px)",
    flexDirection: "column",
    width: "100%",
  },
}));

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

const LoginPage = () => {
  const { login } = useAuthentication();
  const router = useRouter();
  const queryParams = router.query;
  const unsafeRedirect = String(queryParams.redirect ?? "/");
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <Group className={classes.loginBox}>
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
