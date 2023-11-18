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
import { getMe } from "../../api/usersApi";

export default async function MainPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;
  const { t } = await initTranslations(locale, ["common"]);

  let me: ApiUsersUserResponse | undefined = undefined;
  if (token) {
    const meResponse = await getMe(token);
    if ("error" in meResponse) {
      if (meResponse.error === "Unauthorized") {
        cookies().delete("token");
      } else {
        me = undefined;
      }
    } else {
      me = meResponse;
    }
  }

  if (me) {
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

    return (
      <div className={styles.dashboardContainer}>
        <Dashboard
          username={me.username}
          isFrontPage={true}
          allEntries={response.data.map((e) => ({
            ...e,
            start_time: new Date(e.start_time),
            dayStart: startOfDay(new Date(e.start_time)),
          }))}
          defaultDayRange={defaultDayRange ?? null}
          smoothCharts={smoothCharts}
          locale={locale}
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
