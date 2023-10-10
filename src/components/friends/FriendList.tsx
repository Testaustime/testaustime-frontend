import { Button, Table, Text } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { ApiFriendsResponseItem, useFriends } from "../../hooks/useFriends";
import { useTranslation } from "next-i18next";
import { prettyDuration } from "../../utils/dateUtils";
import { useModals } from "@mantine/modals";
import { Dashboard } from "../Dashboard";
import { showNotification } from "@mantine/notifications";
import styles from "./FriendList.module.css";

export type FriendListProps = {
  initialFriends?: ApiFriendsResponseItem[];
  ownTimeCoded?: number;
};

export const FriendList = ({
  initialFriends,
  ownTimeCoded,
}: FriendListProps) => {
  const { unFriend, friends } = useFriends({ initialFriends });

  const { t } = useTranslation();
  const { username } = useAuthentication();
  const modals = useModals();

  if (!username) {
    return <Text>{t("friends.notLoggedIn")}</Text>;
  }

  const friendsSorted = [
    ...friends
      .map((f) => ({ ...f, isMe: false }))
      .concat({
        coding_time: {
          all_time: 0,
          past_month: ownTimeCoded ?? 0,
          past_week: 0,
        },
        isMe: true,
        username,
      }),
  ].sort((a, b) => b.coding_time.past_month - a.coding_time.past_month);

  const openFriendDashboard = (friendUsername: string) => {
    modals.openModal({
      title: t("friends.friendDashboardTitle", { username: friendUsername }),
      size: "calc(800px + 10%)",
      children: <Dashboard username={friendUsername} isFrontPage={false} />,
      styles: {
        title: {
          fontSize: "2rem",
          marginBlock: "0.5rem",
          fontWeight: "bold",
        },
      },
    });
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t("friends.index")}</Table.Th>
          <Table.Th>{t("friends.friendName")}</Table.Th>
          <Table.Th>{t("friends.timeCoded", { days: 30 })}</Table.Th>
          <Table.Th />
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {friendsSorted.map(
          ({ username, coding_time: { past_month }, isMe }, idx) => (
            <Table.Tr
              key={username}
              className={isMe ? styles.tableRow : undefined}
            >
              <Table.Td>{idx + 1}</Table.Td>
              <Table.Td>{username}</Table.Td>
              <Table.Td>{prettyDuration(past_month)}</Table.Td>
              <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="filled"
                    color="blue"
                    size="compact-md"
                    onClick={() => {
                      openFriendDashboard(username);
                    }}
                  >
                    {t("friends.showDashboard")}
                  </Button>
                )}
              </Table.Td>
              <Table.Td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="outline"
                    color="red"
                    size="compact-md"
                    onClick={() => {
                      unFriend(username).catch(() => {
                        showNotification({
                          title: t("error"),
                          color: "red",
                          message: t("friends.errorRemovingFriend"),
                        });
                      });
                    }}
                  >
                    {t("friends.unfriend")}
                  </Button>
                )}
              </Table.Td>
            </Table.Tr>
          ),
        )}
      </Table.Tbody>
    </Table>
  );
};
