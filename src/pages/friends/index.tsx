import { Title } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { FriendList } from "../../components/friends/FriendList";
import { AddFriendForm } from "../../components/friends/AddFriendForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { generateFriendCode } from "../../utils/codeUtils";
import axios from "../../axios";
import { ApiFriendsResponseItem } from "../../hooks/useFriends";
import { ApiUsersUserActivityDataResponseItem } from "../../hooks/useActivityData";
import { addDays, startOfDay } from "date-fns";
import { sumBy } from "../../utils/arrayUtils";
import { ApiUsersUserResponse } from "../../hooks/useAuthentication";

export type FriendPageProps = {
  friendCodePlaceholder: string;
  initialFriends: ApiFriendsResponseItem[];
  ownTimeCoded: number;
  username: string;
};

const FriendPage = (props: FriendPageProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Title order={2} mb={15}>
        {t("friends.addNewFriend")}
      </Title>
      <AddFriendForm friendCodePlaceholder={props.friendCodePlaceholder} />
      <Title order={2} mt={40}>
        {t("friends.yourFriends")}
      </Title>
      <FriendList
        initialFriends={props.initialFriends}
        ownTimeCoded={props.ownTimeCoded}
        username={props.username}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<FriendPageProps> = async ({
  locale,
  req,
}) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const friendsPromise = axios.get<ApiFriendsResponseItem[]>("/friends/list", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": req.socket.remoteAddress,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const ownPromise = axios.get<ApiUsersUserActivityDataResponseItem[]>(
    "/users/@me/activity/data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Forwarded-For": req.socket.remoteAddress,
      },
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  const mePromise = axios.get<ApiUsersUserResponse>("/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Forwarded-For": req.socket.remoteAddress,
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

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en")),
      friendCodePlaceholder: generateFriendCode(),
      initialFriends: friendsResponse.data,
      ownTimeCoded,
      username: meResponse.data.username,
    },
  };
};

export default FriendPage;
