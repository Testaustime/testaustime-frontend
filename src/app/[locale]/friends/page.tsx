import { Title } from "@mantine/core";
import { FriendList } from "../../../components/friends/FriendList";
import { AddFriendForm } from "../../../components/friends/AddFriendForm";
import { generateFriendCode } from "../../../utils/codeUtils";
import axios from "../../../axios";
import { addDays, startOfDay } from "date-fns";
import { sumBy } from "../../../utils/arrayUtils";
import {
  ApiUsersUserActivityDataResponseItem,
  ApiUsersUserResponse,
} from "../../../types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import initTranslations from "../../i18n";

export interface ApiFriendsResponseItem {
  username: string;
  coding_time: {
    all_time: number;
    past_month: number;
    past_week: number;
  };
}

export default async function FriendPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const friendsPromise = axios.get<ApiFriendsResponseItem[]>("/friends/list", {
    headers: {
      Authorization: `Bearer ${token}`,
      // "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const ownPromise = axios.get<ApiUsersUserActivityDataResponseItem[]>(
    "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const mePromise = axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      // "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const [friendsResponse, ownResponse, meResponse] = await Promise.all([
    friendsPromise,
    ownPromise,
    mePromise,
  ]);

  const ownEntries = ownResponse.data
    .map((e) => ({
      ...e,
      dayStart: startOfDay(new Date(e.start_time)),
      start_time: new Date(e.start_time),
    }))
    .filter((entry) => {
      const startOfStatisticsRange = startOfDay(addDays(new Date(), -30));
      return entry.start_time.getTime() >= startOfStatisticsRange.getTime();
    });

  const ownTimeCoded = sumBy(ownEntries, (e) => e.duration);

  const { t } = await initTranslations(locale, ["common"]);

  return (
    <>
      <Title order={2} mb={15}>
        {t("friends.addNewFriend")}
      </Title>
      <AddFriendForm
        friendCodePlaceholder={generateFriendCode()}
        texts={{
          friendCodeRequired: t("friends.friendCodeRequired"),
          friendCodeInvalid: t("friends.friendCodeInvalid"),
          error: t("error"),
          alreadyFriends: t("friends.error.alreadyFriends"),
          notFound: t("friends.error.notFound"),
          unknownError: t("friends.error.unknownError"),
          friendCode: t("friends.friendCode"),
          add: t("friends.add"),
        }}
      />
      <Title order={2} mt={40}>
        {t("friends.yourFriends")}
      </Title>
      <FriendList
        friends={friendsResponse.data}
        ownTimeCoded={ownTimeCoded}
        username={meResponse.data.username}
        locale={locale}
        texts={{
          index: t("friends.index"),
          friendName: t("friends.friendName"),
          timeCoded: t("friends.timeCoded", { days: 30 }),
          showDashboard: t("friends.showDashboard"),
          error: t("error"),
          errorRemovingFriend: t("friends.errorRemovingFriend"),
          unfriend: t("friends.unfriend"),
          friendDashboardTitle: t("friends.friendDashboardTitle", {
            // TODO: Get rid of this replacement
            username: "{{USERNAME_REPLACE_ME}}",
          }),
          dashboard: {
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
          },
        }}
      />
    </>
  );
}
