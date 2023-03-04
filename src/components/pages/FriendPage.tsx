import { Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { FriendList } from "../friends/FriendList";
import { AddFriendForm } from "../friends/AddFriendForm";

export const FriendPage = () => {
  const { t } = useTranslation();

  return <div style={{ height: "calc(100% - 36px - 50px - 80px)" }}>
    <Title order={2} mb={15}>{t("friends.addNewFriend")}</Title>
    <AddFriendForm />
    <Title order={2} mt={40}>{t("friends.yourFriends")}</Title>
    <FriendList />
  </div>;
};
