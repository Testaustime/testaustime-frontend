import { Anchor, Text, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { useAuthentication } from "../../hooks/useAuthentication";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../Dashboard";
import { useTranslation } from "next-i18next";

const useStyles = createStyles(theme => ({
  downloadButton: {
    height: "90px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    flexWrap: "nowrap",
    fontWeight: "bold",
    padding: "0px 10%",
    gap: 15,
    backgroundColor: theme.colorScheme === "dark" ? "#6275bc" : "#7289DA",
    color: "white",
    borderRadius: "6px",
    border: `1px solid ${theme.colorScheme === "dark" ? "#222" : "#ccc"}`,
    "&:hover": {
      backgroundColor: "#667bc4",
      textDecoration: "none"
    }
  },
  heroContainer: {
    height: "400px",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  heroText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.4rem",
    color: theme.colorScheme === "dark" ? "#bbb" : "#333"
  },
  dashboardContainer: {
    height: "calc(100% - 36px - 50px - 80px)",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  downloadIcon: {
    height: "50px",
    display: "flex"
  }
}));

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();
  const { classes } = useStyles();
  const { t } = useTranslation();

  return <div className={!isLoggedIn ? classes.heroContainer : classes.dashboardContainer}>
    {isLoggedIn ? <Dashboard username="@me" isFrontPage={true} /> : <>
      <Text mb={20} className={classes.heroText}>{t("mainPage.hero")}</Text>
      <Anchor className={classes.downloadButton} component={Link} to="/extensions">
        <DownloadIcon height={30} width={30} className={classes.downloadIcon} />
        {t("mainPage.download")}
      </Anchor>
    </>}
  </div>;
};
