import { Anchor, Text, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import useAuthentication from "../../hooks/UseAuthentication";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../Dashboard";

export const MainPage = () => {
  const { isLoggedIn } = useAuthentication();
  const { classes } = createStyles((theme) => ({
    downloadButton: {
      width: "60%",
      height: "90px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
      flexWrap: "nowrap",
      fontWeight: "500",
      padding: "2rem 3rem",
      backgroundColor: theme.colorScheme === "dark" ? "#6275bc" : "#7289DA",
      color: "white",
      borderRadius: "6px",
      border: `1px solid ${theme.colorScheme === "dark" ? "#222" : "#ccc"}`,
      "&:hover": {
        backgroundColor: "#667bc4",
        textDecoration: "none"
      },
      "@media (max-width: 800px)": {
        width: "80%",
      },
      "@media (max-width: 680px)": {
        paddingLeft: "1rem",
        fontSize: "0.8rem",
      },
    },
    heroContainer: {
      height: "400px",
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    heroText: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: "1.4rem",
      color: theme.colorScheme === "dark" ? "#bbb" : "#333",
    },
    dashboardContainer : {
      height: "calc(100% - 36px - 50px - 80px)",
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignContent: "flex-start",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    downloadIcon: {
      height: "50px",
      display: "flex",
      "@media (max-width: 680px)": {
        marginRight: "1rem",
        width: "50px"
      },
    },
  }))();

  return <div className={!isLoggedIn ? classes.heroContainer : classes.dashboardContainer}>
    {isLoggedIn ? <>
      <Dashboard />
    </> : <>
      <Text mb={20} className={classes.heroText}>The ultimate tool for tracking time of your coding sessions. Show the world how dedicated you are to your projects!</Text>
      <Anchor className={classes.downloadButton} component={Link} to="/extensions">
        <DownloadIcon height={30} width={30} className={classes.downloadIcon}></DownloadIcon>
        Download now for your favorite editor
      </Anchor>
    </>}
  </div>;
};