import { Title } from "@mantine/core";
import { FriendList } from "../../../components/friends/FriendList";
import { AddFriendForm } from "../../../components/friends/AddFriendForm";
import { generateFriendCode } from "../../../utils/codeUtils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import initTranslations from "../../i18n";
import { getMe, getOwnActivityDataSummary } from "../../../api/usersApi";
import { getFriendsList } from "../../../api/friendsApi";

export default async function FriendPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const [friendsList, ownDataSummary, me] = await Promise.all([
    getFriendsList(token),
    getOwnActivityDataSummary(token),
    getMe(),
  ]);

  if ("error" in me) {
    if (me.error === "Unauthorized") {
      redirect("/login");
    } else {
      throw new Error(me.error);
    }
  }

  if ("error" in friendsList) {
    if (friendsList.error === "Unauthorized") {
      redirect("/login");
    } else if (friendsList.error === "Too many requests") {
      // TODO: Show something better
      throw new Error("Too many requests");
    } else {
      throw new Error(friendsList.error);
    }
  }

  if ("error" in ownDataSummary) {
    throw new Error(ownDataSummary.error);
  }

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
        friends={friendsList}
        ownTimeCoded={ownDataSummary.last_month.total}
        username={me.username}
        locale={locale}
      />
    </>
  );
}
