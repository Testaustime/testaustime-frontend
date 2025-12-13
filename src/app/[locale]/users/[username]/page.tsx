import { redirect } from "next/navigation";
import { Dashboard } from "../../../../components/Dashboard";
import {
  getCurrentActivityStatus,
  getUserActivityData,
} from "../../../../api/usersApi";
import { CurrentActivity } from "../../../../components/CurrentActivity/CurrentActivity";
import { GetUserActivityDataError } from "../../../../types";
import initTranslations from "../../../i18n";
import { Stack, Title } from "@mantine/core";
import { getPreferences } from "../../../../utils/cookieUtils";

export default async function UserPage({
  params: { locale, username },
}: {
  params: { locale: string; username: string };
}) {
  const data = await getUserActivityData(username);
  const { t } = await initTranslations(locale, ["common"]);

  if ("error" in data) {
    switch (data.error) {
      case GetUserActivityDataError.NotFound:
        return (
          <Stack gap="sm">
            <Title>{username}</Title>
            <div>{t("users.notFound")}</div>
          </Stack>
        );
      case GetUserActivityDataError.RateLimited:
        return redirect("/rate-limited");
      case GetUserActivityDataError.Unauthorized:
        return redirect("/login");
      case GetUserActivityDataError.UnknownError:
        return <div>{t("unknownErrorOccurred")}</div>;
    }
  }

  const decodedUsername = decodeURIComponent(username);

  let currentActivity: CurrentActivity | undefined = undefined;
  const currentActivityResponse =
    await getCurrentActivityStatus(decodedUsername);
  if (!(currentActivityResponse && "error" in currentActivityResponse)) {
    currentActivity = currentActivityResponse ?? undefined;
  }

  const { dayRange, smoothCharts, maxTimeUnit } = getPreferences();

  return (
    <Dashboard
      allEntries={data}
      username={decodedUsername}
      isFrontPage={false}
      locale={locale}
      initialActivity={currentActivity}
      defaultDayRange={dayRange}
      maxTimeUnit={maxTimeUnit}
      smoothCharts={smoothCharts}
    />
  );
}
