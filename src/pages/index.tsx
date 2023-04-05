import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { Anchor, Text, createStyles } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../components/Dashboard";
import axios from "axios";
import { ApiUsersUserActivityDataResponseItem } from "../hooks/useActivityData";
import { startOfDay } from "date-fns";
import { DayRange, isDayRange } from "../utils/dateUtils";
import { defaultDayRangeCookieName, smoothChartsCookieName } from "../utils/constants";

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

export type MainPageProps =
  | { isLoggedIn: false }
  | {
    isLoggedIn: true,
    entries: ApiUsersUserActivityDataResponseItem[],
    defaultDayRange: DayRange | undefined | null,
    smoothCharts: boolean | undefined | null
  };

export const MainPage = (props: MainPageProps) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return <div className={!props.isLoggedIn ? classes.heroContainer : classes.dashboardContainer}>
    {props.isLoggedIn ? <Dashboard
      username="@me"
      isFrontPage={true}
      initialEntries={props.entries.map(e => (
        { ...e, start_time: new Date(e.start_time), dayStart: startOfDay(new Date(e.start_time)) }
      ))}
      defaultDayRange={props.defaultDayRange}
      smoothCharts={props.smoothCharts}
    /> : <>
      <Text mb={20} className={classes.heroText}>{t("mainPage.hero")}</Text>
      <Anchor className={classes.downloadButton} component={Link} href="/extensions">
        <DownloadIcon height={30} width={30} className={classes.downloadIcon} />
        {t("mainPage.download")}
      </Anchor>
    </>}
  </div>;
};

export const getServerSideProps: GetServerSideProps<MainPageProps> = async ({ locale, req }) => {
  const token = req.cookies.token;
  if (!token) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en")),
        isLoggedIn: false
      }
    };
  }

  const response = await axios.get<ApiUsersUserActivityDataResponseItem[]>(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/users/@me/activity/data`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress
      }
    }
  );

  const defaultDayRange = isDayRange(req.cookies[defaultDayRangeCookieName])
    ? req.cookies[defaultDayRangeCookieName]
    : undefined;
  const smoothCharts = (req.cookies[smoothChartsCookieName] || "true") === "true";

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      isLoggedIn: true,
      entries: response.data,
      defaultDayRange: defaultDayRange ?? null,
      smoothCharts: smoothCharts
    }
  };
};

export default MainPage;
