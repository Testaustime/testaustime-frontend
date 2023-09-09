import { Button, Table, Text, useMantineTheme } from "@mantine/core";
import { useAuthentication } from "../../hooks/useAuthentication";
import { ApiFriendsResponseItem, useFriends } from "../../hooks/useFriends";
import { useTranslation } from "next-i18next";
import { prettyDuration } from "../../utils/dateUtils";
import { useModals } from "@mantine/modals";
import { Dashboard } from "../Dashboard";
import { showNotification } from "@mantine/notifications";

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
  const theme = useMantineTheme();
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
      <thead>
        <tr>
          <th>{t("friends.index")}</th>
          <th>{t("friends.friendName")}</th>
          <th>{t("friends.timeCoded", { days: 30 })}</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {friendsSorted.map(
          ({ username, coding_time: { past_month }, isMe }, idx) => (
            <tr
              key={username}
              style={{
                backgroundColor: isMe
                  ? theme.colorScheme === "dark"
                    ? "#2b2b2b"
                    : "#dedede"
                  : undefined,
              }}
            >
              <td>{idx + 1}</td>
              <td>{username}</td>
              <td>{prettyDuration(past_month)}</td>
              <td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="filled"
                    color="blue"
                    compact
                    onClick={() => {
                      openFriendDashboard(username);
                    }}
                  >
                    {t("friends.showDashboard")}
                  </Button>
                )}
              </td>
              <td style={{ textAlign: "right", padding: "7px 0px" }}>
                {!isMe && (
                  <Button
                    variant="outline"
                    color="red"
                    compact
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
              </td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
};
