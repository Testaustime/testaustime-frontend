import { Title } from "@mantine/core";
import { useI18nContext } from "../../i18n/i18n-react";
import { FriendList } from "../friends/FriendList";
import { AddFriendForm } from "../friends/AddFriendForm";

export const FriendPage = () => {
  const { LL } = useI18nContext();

  return <div style={{ height: "calc(100% - 36px - 50px - 80px)" }}>
    <Title order={2} mb={15}>{LL.friends.addNewFriend()}</Title>
    <AddFriendForm />
    <Title order={2} mt={40}>{LL.friends.yourFriends()}</Title>
    <FriendList />
  </div>;
};
