import Link from "next/link";
import { Anchor, Text } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../../components/Dashboard";
import axios from "../../axios";
import { startOfDay } from "date-fns";
import { isDayRange } from "../../utils/dateUtils";
import {
  defaultDayRangeCookieName,
  smoothChartsCookieName,
} from "../../utils/constants";
import styles from "./page.module.css";
import {
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
} from "../../types";
import { cookies } from "next/headers";
import initTranslations from "../i18n";

export default async function MainPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;
  const { t } = await initTranslations(locale, ["common"]);

  if (token) {
    const response = await axios.get<ApiUsersUserActivityDataResponseItem[]>(
      "/users/@me/activity/data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "X-Forwarded-For": req.socket.remoteAddress,
        },
        baseURL: process.env.NEXT_PUBLIC_API_URL,
      },
    );

    const uncheckedDefaultDayRange = cookies().get(defaultDayRangeCookieName)
      ?.value;
    const defaultDayRange = isDayRange(uncheckedDefaultDayRange)
      ? uncheckedDefaultDayRange
      : undefined;
    const smoothCharts =
      (cookies().get(smoothChartsCookieName)?.value || "true") === "true";

    const meResponse = await axios.get<ApiUsersUserResponse>("/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
        // "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    const props = {
      entries: response.data,
      defaultDayRange: defaultDayRange ?? null,
      smoothCharts: smoothCharts,
      username: meResponse.data.username,
    };
    return (
      <div className={styles.dashboardContainer}>
        <Dashboard
          username={props.username}
          isFrontPage={true}
          allEntries={props.entries.map((e) => ({
            ...e,
            start_time: new Date(e.start_time),
            dayStart: startOfDay(new Date(e.start_time)),
          }))}
          defaultDayRange={props.defaultDayRange}
          smoothCharts={props.smoothCharts}
          locale={locale}
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
            editModal: {
              projectName: t("editProject.projectName"),
              save: t("editProject.save"),
            },
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.heroContainer}>
        <Text mb={20} className={styles.heroText}>
          {t("mainPage.hero")}
        </Text>
        <Anchor
          className={styles.downloadButton}
          component={Link}
          href={`/${locale}/extensions`}
        >
          <DownloadIcon
            height={30}
            width={30}
            className={styles.downloadIcon}
          />
          {t("mainPage.download")}
        </Anchor>
      </div>
    );
  }
}
