import { Title } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { FriendList } from "../../components/friends/FriendList";
import { AddFriendForm } from "../../components/friends/AddFriendForm";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { generateFriendCode } from "../../utils/codeUtils";

const FriendPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  return <>
    <Title order={2} mb={15}>{t("friends.addNewFriend")}</Title>
    <AddFriendForm friendCodePlaceholder={props.friendCodePlaceholder} />
    <Title order={2} mt={40}>{t("friends.yourFriends")}</Title>
    <FriendList />
  </>;
};

export const getServerSideProps: GetServerSideProps<{
  friendCodePlaceholder: string
}> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en")),
    friendCodePlaceholder: generateFriendCode()
  }
});

export default FriendPage;
