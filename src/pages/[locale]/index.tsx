import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { Anchor, Text } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../../components/Dashboard";
import axios from "../../axios";
import { startOfDay } from "date-fns";
import { DayRange, isDayRange } from "../../utils/dateUtils";
import {
  defaultDayRangeCookieName,
  smoothChartsCookieName,
} from "../../utils/constants";
import styles from "./index.module.css";
import { PageLayout } from "../../components/PageLayout";
import {
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
} from "../../types";

export type MainPageProps =
  | { isLoggedIn: false; locale: string }
  | {
      isLoggedIn: true;
      username: string;
      entries: ApiUsersUserActivityDataResponseItem[];
      defaultDayRange: DayRange | undefined | null;
      smoothCharts: boolean | undefined | null;
      locale: string;
    };

const MainPage = (props: MainPageProps) => {
  const { t } = useTranslation();

  return (
    <PageLayout
      t={t}
      isLoggedIn={props.isLoggedIn}
      username={"username" in props ? props.username : undefined}
      locale={props.locale}
    >
      <div
        className={
          !props.isLoggedIn ? styles.heroContainer : styles.dashboardContainer
        }
      >
        {props.isLoggedIn ? (
          <Dashboard
            username={props.username}
            isFrontPage={true}
            initialEntries={props.entries.map((e) => ({
              ...e,
              start_time: new Date(e.start_time),
              dayStart: startOfDay(new Date(e.start_time)),
            }))}
            defaultDayRange={props.defaultDayRange}
            smoothCharts={props.smoothCharts}
            locale={props.locale}
            texts={{
              installPrompt: t("dashboard.noData.installPrompt"),
              greeting: t("dashboard.greeting", { username: "{{USERNAME}}" }),
              statisticsTitle: t("dashboard.statistics"),
              projectsLabel: t("dashboard.projects"),
              noProjectsPlaceholder: t("dashboard.noProjects"),
              projectsFilterPlaceholder: t("dashboard.projectsFilter"),
              timeFilters: {
                week: t("dashboard.timeFilters.week"),
                month: t("dashboard.timeFilters.month"),
                all: t("dashboard.timeFilters.all"),
              },
              timePerDay: t("dashboard.timePerDay"),
              noDataTitle: t("dashboard.noData.title"),
              timePerProject: t("dashboard.timePerProject"),
              languagesTitle: t("dashboard.languages"),
              projectsTitle: t("dashboard.projects"),
              totalTime: t("dashboard.totalTime", {
                // TODO: Get rid of these replacements
                days: "{{DAYS}}",
                totalTime: "{{TOTAL_TIME}}",
              }),
              editProjectTitle: t("editProject.title", {
                projectName: "{{PROJECT_NAME}}",
              }),
              unknownProject: t("dashboard.unknownProject"),
            }}
          />
        ) : (
          <>
            <Text mb={20} className={styles.heroText}>
              {t("mainPage.hero")}
            </Text>
            <Anchor
              className={styles.downloadButton}
              component={Link}
              href={`/${props.locale}/extensions`}
            >
              <DownloadIcon
                height={30}
                width={30}
                className={styles.downloadIcon}
              />
              {t("mainPage.download")}
            </Anchor>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<MainPageProps> = async ({
  params,
  req,
}) => {
  const token = req.cookies.token;
  if (!token) {
    return {
      props: {
        ...(await serverSideTranslations(String(params?.locale ?? "en"))),
        isLoggedIn: false,
        locale: String(params?.locale ?? "en"),
      },
    };
  }

  const response = await axios.get<ApiUsersUserActivityDataResponseItem[]>(
    "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const defaultDayRange = isDayRange(req.cookies[defaultDayRangeCookieName])
    ? req.cookies[defaultDayRangeCookieName]
    : undefined;
  const smoothCharts =
    (req.cookies[smoothChartsCookieName] || "true") === "true";

  const meResponse = await axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  return {
    props: {
      ...(await serverSideTranslations(String(params?.locale ?? "en"))),
      isLoggedIn: true,
      entries: response.data,
      defaultDayRange: defaultDayRange ?? null,
      smoothCharts: smoothCharts,
      username: meResponse.data.username,
      locale: String(params?.locale ?? "en"),
    },
  };
};

export default MainPage;
