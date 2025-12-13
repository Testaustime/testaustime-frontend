import Link from "next/link";
import { Anchor, Text } from "@mantine/core";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Dashboard } from "../../components/Dashboard";
import { startOfDay } from "date-fns";
import styles from "./page.module.css";
import { ApiUsersUserResponse } from "../../types";
import { cookies } from "next/headers";
import initTranslations from "../i18n";
import {
  getCurrentActivityStatus,
  getMe,
  getOwnActivityData,
} from "../../api/usersApi";
import { redirect } from "next/navigation";
import { getPreferences } from "../../utils/cookieUtils";

export default async function MainPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["common"]);

  let me: ApiUsersUserResponse | undefined = undefined;
  const token = cookies().get("token")?.value;
  if (token) {
    const meResponse = await getMe();
    if (!meResponse || "error" in meResponse) {
      me = undefined;
    } else {
      me = meResponse;
    }
  }

  if (me) {
    const activityData = await getOwnActivityData(me.username);

    if ("error" in activityData) {
      if (activityData.error === "Too many requests") {
        redirect("/rate-limited");
      }
      throw new Error(JSON.stringify(activityData));
    }

    const currentActivity = await getCurrentActivityStatus(me.username);
    if (currentActivity && "error" in currentActivity) {
      if (currentActivity.error === "Too many requests") {
        redirect("/rate-limited");
      }
      throw new Error(JSON.stringify(currentActivity));
    }

    const { dayRange, smoothCharts, maxTimeUnit } = getPreferences();

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
          defaultDayRange={dayRange}
          smoothCharts={smoothCharts}
          locale={locale}
          initialActivity={currentActivity}
          maxTimeUnit={maxTimeUnit}
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
