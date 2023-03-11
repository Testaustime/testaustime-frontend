import { Title } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { FriendList } from "../../components/friends/FriendList";
import { AddFriendForm } from "../../components/friends/AddFriendForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { generateFriendCode } from "../../utils/codeUtils";
import axios from "axios";
import { ApiFriendsResponseItem } from "../../hooks/useFriends";
import { ApiUsersUserActivityDataResponseItem } from "../../hooks/useActivityData";

export type FriendPageProps = {
  friendCodePlaceholder: string,
  initialFriends: ApiFriendsResponseItem[],
  ownInitialData: ApiUsersUserActivityDataResponseItem[]
}

const FriendPage = (props: FriendPageProps) => {
  const { t } = useTranslation();

  return <>
    <Title order={2} mb={15}>{t("friends.addNewFriend")}</Title>
    <AddFriendForm friendCodePlaceholder={props.friendCodePlaceholder} />
    <Title order={2} mt={40}>{t("friends.yourFriends")}</Title>
    <FriendList initialFriends={props.initialFriends} ownInitialData={props.ownInitialData} />
  </>;
};

export const getServerSideProps: GetServerSideProps<FriendPageProps> = async ({ locale, req }) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const friendsResponse = await axios.get<ApiFriendsResponseItem[]>(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/friends/list`,
    { headers: { Authorization: `Bearer ${token}` } });

  const ownResponse = await axios.get<ApiUsersUserActivityDataResponseItem[]>(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/users/@me/activity/data`,
    { headers: { Authorization: `Bearer ${token}` } });

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      friendCodePlaceholder: generateFriendCode(),
      initialFriends: friendsResponse.data,
      ownInitialData: ownResponse.data
    }
  };
};

export default FriendPage;
