import { Title, Group, createStyles } from "@mantine/core";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useSearchParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import LoginForm from "../LoginForm";
import { useTranslation } from "next-i18next";
const useStyles = createStyles(() => ({
  loginBox: {
    display: "flex",
    height: "calc(100% - 36px - 50px - 80px)",
    flexDirection: "column",
    width: "100%"
  }
}));

const allowedRedirects = ["/profile", "/friends", "/leaderboards"];

export const LoginPage = () => {
  const { login } = useAuthentication();
  const navigate = useNavigate();
  const queryParams = useSearchParams();
  const unsafeRedirect = queryParams[0].get("redirect") || "/";
  const { t } = useTranslation();
  const { classes } = useStyles();

  return <Group className={classes.loginBox}>
    <Title order={1} mb={20}>{t("loginPage.title")}</Title>
    <LoginForm
      onLogin={async (username, password) => {
        try {
          await login(username, password);
          navigate(allowedRedirects.includes(unsafeRedirect) ? unsafeRedirect : "/");
        }
        catch (e) {
          showNotification({
            title: t("error"),
            color: "red",
            message: t("loginPage.invalidCredentials")
          });
        }
      }} />
  </Group>;
};
