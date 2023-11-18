import { Title } from "@mantine/core";
import { FriendList } from "../../../components/friends/FriendList";
import { AddFriendForm } from "../../../components/friends/AddFriendForm";
import { generateFriendCode } from "../../../utils/codeUtils";
import axios from "../../../axios";
import { addDays, startOfDay } from "date-fns";
import { sumBy } from "../../../utils/arrayUtils";
import { ApiUsersUserActivityDataResponseItem } from "../../../types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import initTranslations from "../../i18n";
import { getMe } from "../../../api/usersApi";

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

  const mePromise = getMe(token);

  const [friendsResponse, ownResponse, meResponse] = await Promise.all([
    friendsPromise,
    ownPromise,
    mePromise,
  ]);

  if ("error" in meResponse) {
    if (meResponse.error === "Unauthorized") {
      redirect("/login");
    } else {
      throw new Error(meResponse.error);
    }
  }

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
      <AddFriendForm friendCodePlaceholder={generateFriendCode()} />
      <Title order={2} mt={40}>
        {t("friends.yourFriends")}
      </Title>
      <FriendList
        friends={friendsResponse.data}
        ownTimeCoded={ownTimeCoded}
        username={meResponse.username}
        locale={locale}
      />
    </>
  );
}
