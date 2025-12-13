import { Title } from "@mantine/core";
import { FriendList } from "../../../components/friends/FriendList";
import { AddFriendForm } from "../../../components/friends/AddFriendForm";
import { generateFriendCode } from "../../../utils/codeUtils";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import {
  getCurrentActivityStatus,
  getMe,
  getOwnActivityDataSummary,
} from "../../../api/usersApi";
import { getFriendsList } from "../../../api/friendsApi";
import { getPreferences } from "../../../utils/cookieUtils";

export default async function FriendsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [friendsList, ownDataSummary, me, ownActivityStatus] =
    await Promise.all([
      getFriendsList(),
      getOwnActivityDataSummary(),
      getMe(),
      getCurrentActivityStatus("@me"),
    ]);

  if (!me) {
    redirect("/login");
  }

  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else if (me.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(JSON.stringify(me));
    }
  }

  if ("error" in friendsList) {
    if (friendsList.error === "Unauthorized") {
      redirect("/login");
    } else if (friendsList.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(JSON.stringify(friendsList));
    }
  }

  if ("error" in ownDataSummary) {
    if (ownDataSummary.error === "Too many requests") {
      redirect("/rate-limited");
    } else if (ownDataSummary.error === "Unauthorized") {
      redirect("/login");
    } else {
      throw new Error(JSON.stringify(ownDataSummary));
    }
  }

  if (ownActivityStatus && "error" in ownActivityStatus) {
    if (ownActivityStatus.error === "Too many requests") {
      redirect("/rate-limited");
    } else {
      throw new Error(JSON.stringify(ownActivityStatus));
    }
  }

  // TODO: Activity status should be refreshed every 1 minute.

  const { t } = await initTranslations(locale, ["common"]);

  const { maxTimeUnit } = getPreferences();

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
        friends={friendsList}
        ownTimeCoded={ownDataSummary.last_month.total}
        username={me.username}
        locale={locale}
        ownStatus={ownActivityStatus}
        maxTimeUnit={maxTimeUnit}
      />
    </>
  );
}
