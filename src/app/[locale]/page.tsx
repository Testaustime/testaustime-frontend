import Link from "next/link";
import { Anchor, Text } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../../components/Dashboard";
import { startOfDay } from "date-fns";
import { isDayRange } from "../../utils/dateUtils";
import {
  defaultDayRangeCookieName,
  smoothChartsCookieName,
} from "../../utils/constants";
import styles from "./page.module.css";
import { ApiUsersUserResponse } from "../../types";
import { cookies } from "next/headers";
import initTranslations from "../i18n";
import { getMe, getOwnActivityData } from "../../api/usersApi";

export default async function MainPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;
  const { t } = await initTranslations(locale, ["common"]);

  let me: ApiUsersUserResponse | undefined = undefined;
  if (token) {
    const meResponse = await getMe();
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

  // `&& token` is unnecessary but it makes the type checker happy
  if (me && token) {
    const activityData = await getOwnActivityData(token);

    if ("error" in activityData) {
      if (activityData.error === "Too many requests") {
        throw new Error("Too many requests");
      }
      throw new Error(activityData.error);
    }

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
          allEntries={activityData.map((e) => ({
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
